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
    mapping(address user => mapping(uint256 examId => bytes32 hashedAnswer)) private s_userToAnswers;
    // user can claim either ether if exam is cancelled or NFT if exam has ended
    mapping(address user => mapping(uint256 examId => bool hasClaimed)) private s_userHasClaimed;

    // Exam
    mapping(uint256 id => Exam exam) private s_examIdToExam;
    uint256 private s_timeToCorrectExam = 2*24*60*60; // 2 days;
    uint256 private s_lastExamId; // starts from 0
    uint256 private s_examCreationFee = 2 ether; // 2 dollars
    uint256 private s_submissionFee = 0.05 ether; // 5%;

    // NFT
    uint256 private s_tokenCounter;
    mapping(uint256 => string) private s_tokenIdToUri;
    mapping(uint256 tokenId => uint256 examId) s_tokenIdToExamId;

    // usernames
    mapping(address user => string username) private s_userToUsername;
    mapping(string username => address user) private s_usernameToUser;
    mapping(bytes32 => bool) private s_usedSignatures;
    bool private s_requiresSignature;

    // Pause / Stop
    bool private s_paused;
    bool private s_stopped;  // permanent

    // Whitelist
    address[] private s_whitelist;
    mapping(address => bool) private s_userIsWhitelisted;

    // Chainlink Price Feed address
    address private s_priceFeed;

    // Decimals
    uint256 private constant DECIMALS = 1e18;
    address private constant GOOD_DOLLAR_PROXY = 0xC361A6E67822a0EDc17D899227dd9FC50BD62F42;

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
    ) external payable verifiedOnCelo(msg.sender) {
        if (keccak256(abi.encode(name)) == keccak256(abi.encode(""))) revert Certifier__NameCannotBeEmpty();
        uint256 ethAmountRequired = getUsdToEthRate(s_examCreationFee);
        if (s_userIsWhitelisted[msg.sender]) ethAmountRequired = 0;
        if (msg.value < ethAmountRequired) revert Certifier__NotEnoughEther(msg.value, ethAmountRequired);
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
            answers: new uint256[](0),
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
    function submitAnswers(uint256 examId, bytes32 hashedAnswer) external payable verifiedOnCelo(msg.sender) {
        if (getStatus(examId) != Status.Started) revert Certifier__ExamEndedOrCancelled(examId, uint256(getStatus(examId)));
        if (s_userToAnswers[msg.sender][examId] != "") revert Certifier__UserAlreadySubmittedAnswers(examId);
        if (msg.sender == s_examIdToExam[examId].certifier) revert Certifier__CertifierCannotSubmit(examId);
        uint256 ethAmountRequired = getUsdToEthRate(s_examIdToExam[examId].price);
        if (msg.value < ethAmountRequired) revert Certifier__NotEnoughEther(msg.value, ethAmountRequired);
        s_examIdToExam[examId].numberOfSubmissions += 1;
        if ((s_examIdToExam[examId].maxSubmissions != 0) && (s_examIdToExam[examId].maxSubmissions < s_examIdToExam[examId].numberOfSubmissions))
            revert Certifier__MaxSubmissionsReached(examId, s_examIdToExam[examId].maxSubmissions, s_examIdToExam[examId].numberOfSubmissions);

        uint256 feeAmount = msg.value * s_submissionFee / DECIMALS;
        s_examIdToExam[examId].etherAccumulated += (msg.value - feeAmount);
        transferEther(s_feeCollector, feeAmount);
        s_userToExamIds[msg.sender].push(examId);
        s_userToAnswers[msg.sender][examId] = hashedAnswer;
        s_examIdToExam[examId].users.push(msg.sender);

        emit SubmitAnswers(msg.sender, examId, hashedAnswer);
    }

    /// @inheritdoc ICertifier
    function correctExam(uint256 examId, uint256[] memory answers) external nonReentrant {
        if (getStatus(examId) != Status.NeedsCorrection) revert Certifier__NotTheTimeForExamCorrection(examId, uint256(getStatus(examId)));
        if (msg.sender != s_examIdToExam[examId].certifier) revert Certifier__OnlyCertifierCanCorrect(examId);

        s_examIdToExam[examId].answers = answers;

        uint256 ethToCollect = s_examIdToExam[examId].etherAccumulated;
        if (ethToCollect > 0) {
            transferEther(msg.sender, ethToCollect);
            s_examIdToExam[examId].etherAccumulated = 0;
        }

        emit CorrectExam(examId, answers);
    }

    /// @inheritdoc ICertifier
    function claimCertificate(uint256 examId, uint256[] memory answers, uint256 secretNumber) external nonReentrant returns (bool) {
        if (getStatus(examId) != Status.Ended) revert Certifier__ExamHasNotEnded(examId, uint256(getStatus(examId)));
        if (s_userHasClaimed[msg.sender][examId]) revert Certifier__UserAlreadyClaimedNFT(examId);

        uint256 userAnswersAsNumber = getAnswerAsNumber(answers);
        bytes32 expectedHashedAnswer = keccak256(abi.encodePacked(userAnswersAsNumber, secretNumber, msg.sender));
        if (expectedHashedAnswer != s_userToAnswers[msg.sender][examId]) revert Certifier__AnswerHashesDontMatch(expectedHashedAnswer, s_userToAnswers[msg.sender][examId]);

        uint256 score = getScore(s_examIdToExam[examId].answers, answers);
        if (score < s_examIdToExam[examId].baseScore) return false;

        s_userHasClaimed[msg.sender][examId] = true;

        string memory tokenUri = makeTokenUri(examId, score);
        s_tokenIdToUri[s_tokenCounter] = tokenUri;
        s_tokenIdToExamId[s_tokenCounter] = examId;
        s_examIdToExam[examId].tokenIds.push(s_tokenCounter);

        _safeMint(msg.sender, s_tokenCounter);
        emit ClaimNFT(msg.sender, examId, s_tokenCounter);

        s_tokenCounter++;
        return true;
    }

    /// @inheritdoc ICertifier
    function refundExam(uint256 examId) external nonReentrant {
        if (getStatus(examId) != Status.Cancelled) revert Certifier__ExamIsNotCancelled(examId, uint256(getStatus(examId)));
        if (s_userToAnswers[msg.sender][examId] == "") revert Certifier__UserDidNotParticipate(examId);
        if (s_userHasClaimed[msg.sender][examId]) revert Certifier__UserAlreadyClaimedCancelledExam(examId);
        if (s_examIdToExam[examId].price == 0) revert Certifier__ThisExamIsNotPaid(examId);

        uint256 ethAmount = getUsdToEthRate(s_examIdToExam[examId].price);
        uint256 feeAmount = ethAmount * s_submissionFee / DECIMALS;
        transferEther(msg.sender, ethAmount - feeAmount);
        s_userHasClaimed[msg.sender][examId] = true;

        emit ClaimRefund(examId, msg.sender);
    }

    /*//////////////////////////////////////////////////////////////
                           PUBLIC FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    // override
    function tokenURI(uint256 tokenId) public view override(ERC721Upgradeable, ICertifier) returns (string memory) {
        _requireOwned(tokenId);
        return s_tokenIdToUri[tokenId];
    }

    // chainlink oracle
    function getUsdToEthRate(uint256 usdAmount) public view returns (uint256) {
        uint256 ethToUsd = PriceConverter.getConversionRate(1e18, s_priceFeed);
        uint256 usdToEthRate = 1e18 * DECIMALS / ethToUsd;
        uint256 ethAmount = usdAmount * usdToEthRate / DECIMALS;
        return ethAmount;
    }

    function getStatus(uint256 examId) public view returns (Status) {
        if (s_examIdToExam[examId].answers.length > 0) return Status.Ended; // terminal
        if (block.timestamp > s_examIdToExam[examId].endTime + s_timeToCorrectExam) return Status.Cancelled; // terminal
        if (block.timestamp > s_examIdToExam[examId].endTime) return Status.NeedsCorrection;
        return Status.Started;
    }

    function getIsVerifiedOnCelo(address user) public view returns (bool) {
        if (block.chainid != 42220) revert Certifier__VerificationAvailableOnlyOnCelo();
        return IGoodDollarVerifierProxy(GOOD_DOLLAR_PROXY).isWhitelisted(user);
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

    function getAnswerAsNumber(uint256[] memory answers) private pure returns (uint256) {
        uint256 result = 0;
        for (uint256 i = 0; i < answers.length; i++) {
            result += answers[i] * (10 ** i);
        }
        return result;
    }

    function getScore(uint256[] memory correctAnswers, uint256[] memory userAnswers) private pure returns (uint256) {
        if (correctAnswers.length != userAnswers.length) revert Certifier__AnswersLengthDontMatch(correctAnswers.length, userAnswers.length);

        uint256 score = 0;
        for (uint256 i = 0; i < correctAnswers.length; i++)
            if (correctAnswers[i] == userAnswers[i])
                score++;
        return score;
    }

    function makeTokenUri(uint256 examId, uint256 score) private view returns (string memory) {
        string memory tokenId = s_tokenCounter.toString();
        string memory examName = s_examIdToExam[examId].name;
        string memory examDescription = s_examIdToExam[examId].description;
        string memory scoreStr = score.toString();
        string memory numOfQuestions = s_examIdToExam[examId].questions.length.toString();
        string memory base = s_examIdToExam[examId].baseScore.toString();
        string memory certifier = s_examIdToExam[examId].certifier.toHexString();
        string memory imageUrl = s_examIdToExam[examId].imageUrl;

        return string(
            abi.encodePacked(
                _baseURI(),
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name": "', examName, " | ", name(), " #", tokenId,
                            '", "description": "An NFT that represents a certificate.", ',
                            '"attributes":[',
                            '{"trait_type": "exam_name", "value": "', examName, '"}, ',
                            '{"trait_type": "exam_description", "value": "', examDescription, '"}, ',
                            '{"trait_type": "my_score", "value": "', scoreStr, "/", numOfQuestions, '"}, ',
                            '{"trait_type": "exam_base_score", "value": ', base, "}, ",
                            '{"trait_type": "certifier", "value": "', certifier, '"}, ',
                            '{"trait_type": "exam_id", "value": ', examId.toString(), "} ",
                            '], "image": "', imageUrl, '"}'
                        )
                    )
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

    function getUserAnswer(address user, uint256 examId) external view returns (bytes32) {
        return s_userToAnswers[user][examId];
    }

    function getUserHasClaimed(address user, uint256 examId) external view returns (bool) {
        return s_userHasClaimed[user][examId];
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
    }

    function setPriceFeed(address priceFeed) external onlyOwner {
        s_priceFeed = priceFeed;
    }
}
