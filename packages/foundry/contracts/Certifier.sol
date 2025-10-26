// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import {ICertifier} from "./interfaces/ICertifier.sol";
import {IEngagementRewards} from "./interfaces/IEngagementRewards.sol";
import {PriceConverter} from "./lib/PriceConverter.sol";
import {IGoodDollarVerifierProxy} from "./interfaces/IGoodDollarVerifierProxy.sol";

/**
 * @title Certifier
 * @author Spyros
 * 
 * @notice This is a smart contract that allows certifiers to create exams and
 * users to get certified with NFT certificates.
 * @notice Prevents users from seeing other students' answers until they claim their NFT certificate.
 * @notice Prevents frontrunning attacks when users try to claim their NFT certificate.
 * 
 * System operates in stages. 
 * - Stage 1: The exam is created and users can submit their answers
 *     until the exam exceeds the date set by the certifier.
 * - Stage 2: The exam is corrected by the certifier and the users can't submit their answers anymore.
 * - Stage 3: The users can claim their NFT certificate or their refund depending on whether  
 *     the certifier corrected the exam in time.
 */
contract Certifier is Initializable, UUPSUpgradeable, OwnableUpgradeable, ICertifier, ERC721Upgradeable, ReentrancyGuard {
    using Strings for uint256;
    using Strings for address;
    using Strings for string;

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    
    // Fee Collector
    address private s_feeCollector;

    // Signer
    address private s_signer;

    // Certifier
    mapping(address certifier => uint256[] examIds) private s_certifierToExamIds;

    // User
    address[] private s_users;
    mapping(address user => uint256[] examIds) private s_userToExamIds;
    // User string answers
    mapping(address user => mapping(uint256 examId => string stringAnswers)) private s_userToStringAnswers;
    // User hashed answers
    mapping(address user => mapping(uint256 examId => bytes32 hashedAnswers)) private s_userToHashedAnswers;
    // User status
    mapping(address user => mapping(uint256 examId => UserStatus status)) private s_userStatus;
    // User to tokenId of exam
    mapping(address user => mapping(uint256 examId => uint256 tokenId)) private s_userToTokenId;  // TODO REPURPOSE

    // Exam
    mapping(uint256 id => Exam exam) private s_examIdToExam;
    uint256 private s_timeToCorrectExam = 2*24*60*60; // 2 days;
    uint256 private s_lastExamId; // starts from 0
    uint256 private s_examCreationFee = 2 ether; // 2 dollars
    uint256 private s_submissionFee = 0.05 ether; // 5%;

    // NFT
    uint256 private s_tokenCounter;
    mapping(uint256 => string) private s_tokenIdToUri;
    mapping(uint256 tokenId => uint256 examId) s_tokenIdToExamId;  // TODO REPURPOSE

    // usernames  // TODO REPURPOSE
    mapping(address user => string username) private s_userToUsername;
    mapping(string username => address user) private s_usernameToUser;
    mapping(bytes32 => bool) private s_usedSignatures;
    bool private s_requiresSignature;

    // Pause / Stop
    bool private s_paused;
    bool private s_stopped;  // permanent

    // Whitelist  // TODO REPURPOSE
    address[] private s_whitelist;
    mapping(address => bool) private s_userIsWhitelisted;

    // Chainlink Price Feed address
    address private s_priceFeed;

    // Decimals
    uint256 private constant DECIMALS = 1e18;
    address private constant GOOD_DOLLAR_PROXY = 0xC361A6E67822a0EDc17D899227dd9FC50BD62F42;

    // XP
    uint256[] private s_examsWithXp;
    mapping(uint256 examId => uint256 xp) private s_examIdToXp;  // XP that users earn for each exam

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address priceFeed, uint256 timeToCorrectExam, uint256 examCreationFee, uint256 submissionFee) public initializer {
        __Ownable_init(msg.sender);
        __ERC721_init("Web3 Certifier", "W3C");
        __UUPSUpgradeable_init();
        s_feeCollector = msg.sender;
        s_signer = msg.sender;
        s_priceFeed = priceFeed;
        s_timeToCorrectExam = timeToCorrectExam;
        s_examCreationFee = examCreationFee;
        s_submissionFee = submissionFee;
    }

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier verifiedOnCelo(address user) {
        if (block.chainid == 42220) {
            if (!getIsVerifiedOnCelo(user))
                revert Certifier__UserIsNotVerified(user);
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                          EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @inheritdoc ICertifier
    function createExam(
        string memory name,
        string memory description,
        uint256 endTime,
        string[] memory questions,
        uint256 price,
        uint256 baseScore,
        string memory imageUrl,
        uint256 maxSubmissions,
        bool userClaimsWithPassword
    ) external payable {
        if (keccak256(abi.encode(name)) == keccak256(abi.encode(""))) revert Certifier__NameCannotBeEmpty();
        uint256 ethAmountRequired = getUsdToEthRate(s_examCreationFee);
        if (s_userIsWhitelisted[msg.sender]) ethAmountRequired = 0;
        else if (msg.value < ethAmountRequired - (ethAmountRequired / 100)) revert Certifier__NotEnoughEther(msg.value, ethAmountRequired);
        if (questions.length == 0) revert Certifier__QuestionsCannotBeEmpty();
        if (baseScore > questions.length) revert Certifier__BaseScoreExceedsNumberOfQuestions();
        if (endTime < block.timestamp) revert Certifier__EndTimeIsInThePast(endTime, block.timestamp);
        if (s_paused || s_stopped) revert Certifier__ContractIsPausedOrStopped();

        Exam memory exam = Exam({
            id: s_lastExamId,
            name: name,
            description: description,
            endTime: endTime,
            questions: questions,
            answers: "",
            price: price,
            baseScore: baseScore,
            imageUrl: imageUrl,
            users: new address[](0),
            etherAccumulated: 0,
            certifier: msg.sender,
            tokenIds: new uint256[](0),
            maxSubmissions: maxSubmissions,
            numberOfSubmissions: 0,
            userClaimsWithPassword: userClaimsWithPassword
        });

        transferEther(s_feeCollector, msg.value);

        emit CreateExam(
            exam.id,
            exam.name,
            exam.description,
            exam.endTime,
            exam.questions,
            exam.answers,
            exam.price,
            exam.baseScore,
            exam.imageUrl,
            exam.users,
            exam.etherAccumulated,
            exam.certifier,
            exam.maxSubmissions,
            exam.userClaimsWithPassword
        );

        s_examIdToExam[s_lastExamId] = exam;
        s_certifierToExamIds[msg.sender].push(s_lastExamId);
        s_lastExamId++;
    }

    /// @inheritdoc ICertifier
    function submitAnswers(uint256 examId, bytes32 hashedAnswer, address inviter, uint256 validUntilBlock, bytes memory signature) external payable verifiedOnCelo(msg.sender) {
        ExamStatus status = getExamStatus(examId);
        if (status != ExamStatus.Open) revert Certifier__ExamEndedOrCancelled(examId, uint256(status));
        UserStatus userStatus = s_userStatus[msg.sender][examId];
        if (userStatus != UserStatus.NotSubmitted) revert Certifier__UserCannotSubmit(examId, uint256(userStatus));
        if (msg.sender == s_examIdToExam[examId].certifier) revert Certifier__CertifierCannotSubmit(examId);
        uint256 ethAmountRequired = getUsdToEthRate(s_examIdToExam[examId].price);
        if (msg.value < ethAmountRequired) revert Certifier__NotEnoughEther(msg.value, ethAmountRequired);
        s_examIdToExam[examId].numberOfSubmissions += 1;
        if ((s_examIdToExam[examId].maxSubmissions != 0) && (s_examIdToExam[examId].maxSubmissions < s_examIdToExam[examId].numberOfSubmissions))
            revert Certifier__MaxSubmissionsReached(examId, s_examIdToExam[examId].maxSubmissions, s_examIdToExam[examId].numberOfSubmissions);

        s_userStatus[msg.sender][examId] = UserStatus.Submitted;
        uint256 feeAmount = msg.value * s_submissionFee / DECIMALS;
        s_examIdToExam[examId].etherAccumulated += (msg.value - feeAmount);
        transferEther(s_feeCollector, feeAmount);
        s_userToExamIds[msg.sender].push(examId);
        s_userToHashedAnswers[msg.sender][examId] = hashedAnswer;
        s_examIdToExam[examId].users.push(msg.sender);

        if (block.chainid == 42220) {
            try IEngagementRewards(0x25db74CF4E7BA120526fd87e159CF656d94bAE43).appClaim(
                msg.sender,
                inviter,
                validUntilBlock,
                signature
            ) returns (bool success) {
                if (!success) {
                    emit EngagementRewardClaimFailed("Claim returned false");
                }
            } catch Error(string memory reason) {
                emit EngagementRewardClaimFailed(reason);
            } catch {
                emit EngagementRewardClaimFailed("unknown error");
            }
        }

        emit SubmitAnswers(msg.sender, examId, hashedAnswer);
    }

    /// @inheritdoc ICertifier
    function correctExam(uint256 examId, string memory answers) external nonReentrant {
        if (getExamStatus(examId) != ExamStatus.UnderCorrection) revert Certifier__NotTheTimeForExamCorrection(examId, uint256(getExamStatus(examId)));
        if (msg.sender != s_examIdToExam[examId].certifier) revert Certifier__OnlyCertifierCanCorrect(examId);

        s_examIdToExam[examId].answers = answers;

        uint256 ethToCollect = s_examIdToExam[examId].etherAccumulated;
        if (ethToCollect > 0) {
            transferEther(msg.sender, ethToCollect);
            s_examIdToExam[examId].etherAccumulated = 0;
        }

        emit CorrectExam(examId, answers, ethToCollect);
    }

    // s_userStatus;
    // s_userToTokenId;
    /// @inheritdoc ICertifier
    function claimCertificate(uint256 examId, string memory answers, uint256 secretNumber) external nonReentrant {
        ExamStatus examStatus = getExamStatus(examId);
        if (examStatus != ExamStatus.Corrected) revert Certifier__ExamHasNotEnded(examId, uint256(examStatus));
        UserStatus userStatus = s_userStatus[msg.sender][examId];
        if (userStatus != UserStatus.Submitted) revert Certifier__UserCannotClaimNFT(examId, uint256(userStatus));

        // Check if answer hashes match
        (bool hashesMatch, bytes32 submittedHashedAnswer, bytes32 expectedHashedAnswer) =
            getHashesMatch(examId, answers, secretNumber);
        if (!hashesMatch) revert Certifier__AnswerHashesDontMatch(submittedHashedAnswer, expectedHashedAnswer);

        uint256 score = getScore(s_examIdToExam[examId].answers, answers);
        s_userToStringAnswers[msg.sender][examId] = answers;

        if (score < s_examIdToExam[examId].baseScore) {
            s_userStatus[msg.sender][examId] = UserStatus.Failed;
            emit UserFailed(msg.sender, examId, answers);
            return;
        }
        s_userStatus[msg.sender][examId] = UserStatus.Succeeded;

        string memory tokenUri = makeTokenUri(examId, score);
        s_tokenIdToUri[s_tokenCounter] = tokenUri;
        s_tokenIdToExamId[s_tokenCounter] = examId;
        s_examIdToExam[examId].tokenIds.push(s_tokenCounter);
        s_userToTokenId[msg.sender][examId] = s_tokenCounter;

        _safeMint(msg.sender, s_tokenCounter);
        emit ClaimNFT(msg.sender, examId, answers, s_tokenCounter);

        s_tokenCounter++;
    }

    /// @inheritdoc ICertifier
    function refundExam(uint256 examId) external nonReentrant {
        ExamStatus examStatus = getExamStatus(examId);
        if (examStatus != ExamStatus.Cancelled) revert Certifier__ExamIsNotCancelled(examId, uint256(examStatus));
        UserStatus userStatus = s_userStatus[msg.sender][examId];
        if (userStatus != UserStatus.Submitted) revert Certifier__UserCannotClaimRefund(examId, uint256(userStatus));
        if (s_examIdToExam[examId].price == 0) revert Certifier__ThisExamIsNotPaid(examId);

        uint256 ethAmount = getUsdToEthRate(s_examIdToExam[examId].price);
        uint256 feeAmount = ethAmount * s_submissionFee / DECIMALS;
        transferEther(msg.sender, ethAmount - feeAmount);
        s_userStatus[msg.sender][examId] = UserStatus.Refunded;

        emit ClaimRefund(examId, msg.sender, ethAmount - feeAmount);
    }

    /*//////////////////////////////////////////////////////////////
                           PUBLIC FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    // override
    function tokenURI(uint256 tokenId) public view override(ERC721Upgradeable, ICertifier) returns (string memory) {
        _requireOwned(tokenId);
        return s_tokenIdToUri[tokenId];
    }
    
    // override
    function transferFrom(address from, address to, uint256 tokenId) public override {
        ERC721Upgradeable.transferFrom(from, to, tokenId);
        delete s_userToTokenId[from][s_tokenIdToExamId[tokenId]];
        s_userToTokenId[to][s_tokenIdToExamId[tokenId]] = tokenId;
    }

    // chainlink oracle
    function getUsdToEthRate(uint256 usdAmount) public view returns (uint256) {
        uint256 ethToUsd = PriceConverter.getConversionRate(1e18, s_priceFeed);
        uint256 usdToEthRate = 1e18 * DECIMALS / ethToUsd;
        uint256 ethAmount = usdAmount * usdToEthRate / DECIMALS;
        return ethAmount;
    }

    function getExamStatus(uint256 examId) public view returns (ExamStatus) {
        if (bytes(s_examIdToExam[examId].answers).length > 0) return ExamStatus.Corrected; // terminal
        if (block.timestamp > s_examIdToExam[examId].endTime + s_timeToCorrectExam) return ExamStatus.Cancelled; // terminal
        if (block.timestamp > s_examIdToExam[examId].endTime) return ExamStatus.UnderCorrection;
        return ExamStatus.Open;
    }

    function getIsVerifiedOnCelo(address user) public view returns (bool) {
        if (block.chainid != 42220) revert Certifier__VerificationAvailableOnlyOnCelo();
        return IGoodDollarVerifierProxy(GOOD_DOLLAR_PROXY).isWhitelisted(user);
    }

    function getHashesMatch(
        uint256 examId, string memory answers, uint256 secretNumber
    ) public view returns (
        bool, bytes32, bytes32
    ) {
        bytes32 expectedHashedAnswer = keccak256(abi.encodePacked(answers, secretNumber, msg.sender));
        bytes32 submittedHashedAnswer = s_userToHashedAnswers[msg.sender][examId];
        bool hashesMatch = expectedHashedAnswer == submittedHashedAnswer;
        return (hashesMatch, submittedHashedAnswer, expectedHashedAnswer);
    }

    /*//////////////////////////////////////////////////////////////
                          INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /*//////////////////////////////////////////////////////////////
                           PRIVATE FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function transferEther(address to, uint256 amount) private {
        (bool success,) = to.call{value: amount}("");
        if (!success) revert Certifier__EtherTransferFailed();
    }

    function getScore(string memory correctAnswers, string memory userAnswers) private pure returns (uint256) {
        uint256 correctAnswersLength = bytes(userAnswers).length;
        uint256 userAnswersLength = bytes(userAnswers).length;
        if (correctAnswersLength != userAnswersLength) revert Certifier__AnswersLengthDontMatch(correctAnswersLength, userAnswersLength);

        bytes memory byteForCorrectAnswer = new bytes(1);
        bytes memory byteForUserAnswer = new bytes(1);
        
        uint256 score = 0;
        for (uint256 i = 0; i < correctAnswersLength; i++) {
            byteForCorrectAnswer[0] = bytes(correctAnswers)[i];
            byteForUserAnswer[0] = bytes(userAnswers)[i];

            if (keccak256(abi.encode(string(byteForCorrectAnswer))) == keccak256(abi.encode(string(byteForUserAnswer))))
                score++;
        }
        return score;
    }

    function makeTokenUri(uint256 examId, uint256 score) private view returns (string memory) {
        string memory nameLine = string.concat(
            '{"name": "', s_examIdToExam[examId].name, " | ", name(), " #", s_tokenCounter.toString()
        );
        string memory descriptionLine = string.concat(
            '", "description": "An NFT that represents a certificate.", '
        );
        string memory attributesLine = string.concat(
            '"attributes":[',
            '{"trait_type": "exam_name", "value": "', s_examIdToExam[examId].name, '"}, ',
            '{"trait_type": "exam_description", "value": "', s_examIdToExam[examId].description, '"}, ',
            '{"trait_type": "my_score", "value": ', score.toString(), '}, ',
            '{"trait_type": "number_of_questions", "value": ', s_examIdToExam[examId].questions.length.toString(), '}, ',
            '{"trait_type": "exam_base_score", "value": ', s_examIdToExam[examId].baseScore.toString(), "}, ",
            '{"trait_type": "initial_owner", "value": "', msg.sender.toHexString(), '"}, ',
            '{"trait_type": "exam_id", "value": ', examId.toString(), "}",
            '], "image": "', s_examIdToExam[examId].imageUrl, '"}'
        );
        return string(
            abi.encodePacked(
                _baseURI(),
                Base64.encode(
                    bytes(string.concat(nameLine, descriptionLine, attributesLine))
                )
            )
        );
    }

    function _removeFromWhitelist(address user) private {
        if (s_whitelist.length == 0) return;

        bool shift;
        uint256 arrayLength = s_whitelist.length;
        for (uint256 i = 0; i < arrayLength - 1; i++) {
            if (s_whitelist[i] == user) shift = true;
            if (shift) s_whitelist[i] = s_whitelist[i + 1];
        }
        if (shift || s_whitelist[s_whitelist.length - 1] == user)
            s_whitelist.pop();
    }

    function _removeFromIntArray(uint256[] memory array, uint256 number) private pure returns(uint256[] memory, bool canPop) {
        if (array.length == 0) return (array, false);

        bool shift;
        uint256 arrayLength = array.length;
        for (uint256 i = 0; i < arrayLength - 1; i++) {
            if (array[i] == number) shift = true;
            if (shift) array[i] = array[i + 1];
        }
        if (shift || array[array.length - 1] == number) return (array, true);
        return (array, false);
    }

    /**
     * @notice Checks if the signature has been used and if it has reverts.
     * @notice Checks if the signature is valid and reverts if it is not.
     * @notice Stores the signature so that it cannot be reused.
     * 
     * @param username Token name
     * @param nonce Nonce used for the signature
     * @param signature The signature from the signer
     */
    function _checkSignatureAndStore(
        string memory username,
        uint256 nonce,
        bytes memory signature
    ) private {
        if (s_usedSignatures[keccak256(signature)]) revert ReusedSignature();

        bytes32 message = keccak256(abi.encodePacked(username, nonce, address(this), block.chainid, msg.sender));

        if (!SignatureChecker.isValidSignatureNow(s_signer, MessageHashUtils.toEthSignedMessageHash(message), signature))
            revert InvalidSignature();

        s_usedSignatures[keccak256(signature)] = true;
    }

    /*//////////////////////////////////////////////////////////////
                           GETTER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function getUserScore(uint256 examId, address user) public view returns (uint256) {
        return getScore(s_examIdToExam[examId].answers, s_userToStringAnswers[user][examId]);
    }

    function getFeeCollector() external view returns (address) {
        return s_feeCollector;
    }

    function getCertifierExams(address certifier) external view returns (uint256[] memory) {
        return s_certifierToExamIds[certifier];
    }

    function getUserExams(address user) external view returns (uint256[] memory) {
        return s_userToExamIds[user];
    }

    function getUsers() external view returns (address[] memory) {
        return s_users;
    }

    function getUser(uint256 index) external view returns (address) {
        return s_users[index];
    }

    function getUserHashedAnswer(address user, uint256 examId) external view returns (bytes32) {
        return s_userToHashedAnswers[user][examId];
    }

    function getUserStringAnswer(address user, uint256 examId) external view returns (string memory) {
        return s_userToStringAnswers[user][examId];
    }

    function getExam(uint256 id) external view returns (Exam memory) {
        return s_examIdToExam[id];
    }

    function getLastExamId() external view returns (uint256) {
        return s_lastExamId;
    }

    function getExamCreationFee() external view returns (uint256) {
        return s_examCreationFee;
    }

    function getSubmissionFee() external view returns (uint256) {
        return s_submissionFee;
    }

    function getTimeToCorrectExam() external view returns (uint256) {
        return s_timeToCorrectExam;
    }

    function getTokenCounter() external view returns (uint256) {
        return s_tokenCounter;
    }

    function getUsername(address user) external view returns (string memory) {
        return s_userToUsername[user];
    }

    function getUserFromUsername(string memory username) external view returns (address) {
        return s_usernameToUser[username];
    }

    function getDecimals() external pure returns (uint256) {
        return DECIMALS;
    }

    function getIsPaused() external view returns (bool) {
        return s_paused;
    }

    function getIsStopped() external view returns (bool) {
        return s_stopped;
    }

    function getWhitelist() external view returns (address[] memory) {
        return s_whitelist;
    }

    function getUserIsWhitelisted(address user) external view returns (bool) {
        return s_userIsWhitelisted[user];
    }

    function getSigner() external view returns (address) {
        return s_signer;
    }

    function getRequiresSignature() external view returns (bool) {
        return s_requiresSignature;
    }

    function getUserStatus(address user, uint256 examId) external view returns (UserStatus) {
        return s_userStatus[user][examId];
    }

    function getUserTokenId(address user, uint256 examId) external view returns (uint256) {
        return s_userToTokenId[user][examId];
    }

    function getExamsWithXp() external view returns (uint256[] memory) {
        return s_examsWithXp;
    }

    function getExamXp(uint256 examId) external view returns (uint256) {
        return s_examIdToXp[examId];
    }

    function getUserXP(address user) external view returns (uint256) {
        uint256 xp;
        for (uint256 i = 0; i < s_examsWithXp.length; i++)
            if (s_userStatus[user][s_examsWithXp[i]] == UserStatus.Succeeded)
                xp += s_examIdToXp[s_examsWithXp[i]];
        return xp;
    }

    /*//////////////////////////////////////////////////////////////
                           SETTER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function setFeeCollector(address feeCollector) external onlyOwner {
        s_feeCollector = feeCollector;
        emit SetFeeCollector(feeCollector);
    }

    function setTimeToCorrectExam(uint256 time) external onlyOwner {
        s_timeToCorrectExam = time;
        emit SetTimeToCorrectExam(time);
    }

    function setExamCreationFee(uint256 fee) external onlyOwner {
        s_examCreationFee = fee;
        emit SetExamCreationFee(fee);
    }

    function setSubmissionFee(uint256 fee) external onlyOwner {
        s_submissionFee = fee;
        emit SetSubmissionFee(fee);
    }

    function setUsername(string memory username, uint256 nonce, bytes memory signature) external nonReentrant verifiedOnCelo(msg.sender) {
        if (s_requiresSignature)
            _checkSignatureAndStore(username, nonce, signature);
        s_userToUsername[msg.sender] = username;
        s_usernameToUser[username] = msg.sender;
        emit SetUsername(msg.sender, username);
    }

    function setPaused(bool paused) external onlyOwner {
        s_paused = paused;
        emit SetPaused(paused);
    }

    function setStopped() external onlyOwner {
        s_stopped = true;
        emit Stopped();
    }

    function addToWhitelist(address user) external onlyOwner {
        s_whitelist.push(user);
        s_userIsWhitelisted[user] = true;
        emit AddeToWhitelist(user);
    }

    function removeFromWhitelist(address user) external onlyOwner {
        _removeFromWhitelist(user);
        s_userIsWhitelisted[user] = false;
        emit RemoveFromWhitelist(user);
    }

    function setSigner(address signer) external onlyOwner {
        s_signer = signer;
        emit SetSigner(signer);
    }

    function setRequiresSignature(bool requiresSignature) external onlyOwner {
        s_requiresSignature = requiresSignature;
        emit SetRequiresSignature(requiresSignature);
    }

    function setPriceFeed(address priceFeed) external onlyOwner {
        s_priceFeed = priceFeed;
        emit SetPriceFeed(priceFeed);
    }

    function addExamWithXp(uint256 examId, uint256 xp) external onlyOwner {
        if (s_examIdToXp[examId] > 0) return;

        s_examsWithXp.push(examId);
        s_examIdToXp[examId] = xp;
        emit AddExamWithXp(examId, xp);
    }

    function removeExamWithXp(uint256 examId) external onlyOwner {
        bool canPop;
        (s_examsWithXp, canPop) = _removeFromIntArray(s_examsWithXp, examId);
        if (!canPop) return;
        s_examsWithXp.pop();
        delete s_examIdToXp[examId];
        emit RemoveExamWithXp(examId);
    }

    function updateExamXp(uint256 examId, uint256 xp) external onlyOwner {
        s_examIdToXp[examId] = xp;
        emit UpdateExamXp(examId, xp);
    }
}
