// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface ICertifier {
    
    /*//////////////////////////////////////////////////////////////
                           TYPE DECLARATIONS
    //////////////////////////////////////////////////////////////*/

    enum UserStatus {
        NotSubmitted,
        Submitted,
        Succeeded,
        Failed,
        Refunded
    }

    enum ExamStatus {
        Open,
        UnderCorrection,
        Cancelled,
        Corrected
    }

    struct Exam {
        uint256 id;
        string name;
        string description;
        uint256 endTime;
        string[] questions;
        string answers;
        uint256 price; // in $  TODO replace with exam xp
        uint256 baseScore;
        string imageUrl;
        address[] users;
        uint256 etherAccumulated; // replace
        address certifier;
        uint256[] tokenIds;
        uint256 maxSubmissions;
        uint256 numberOfSubmissions;
        bool userClaimsWithPassword; // replace
    }

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event CreateExam(
        uint256 indexed id,
        string name,
        string description,
        uint256 endTime,
        string[] questions,
        string answers,
        uint256 price,
        uint256 baseScore,
        string imageUrl,
        address[] users,
        uint256 etherAccumulated,
        address certifier,
        uint256 maxSubmissions,
        bool userClaimsWithPassword
    );
    event SubmitAnswers(address user, uint256 examId, bytes32 hashedAnswer);
    event CorrectExam(uint256 examId, string answers, uint256 etherAccumulated);
    event ClaimNFT(address user, uint256 examId, string answers, uint256 tokenId);
    event ClaimRefund(uint256 examId, address user, uint256 amount);
    event SetUsername(address user, string username);
    event SetExamCreationFee(uint256 fee);
    event SetTimeToCorrectExam(uint256 time);
    event SetSubmissionFee(uint256 fee);
    event SetFeeCollector(address feeCollector);
    event SetPaused(bool paused);
    event Stopped();
    event AddeToWhitelist(address user);
    event RemoveFromWhitelist(address user);
    event SetSigner(address signer);
    event SetRequiresSignature(bool requiresSignature);
    event SetPriceFeed(address priceFeed);
    event UserFailed(address user, uint256 examId, string answers);
    event EngagementRewardClaimFailed(string message);
    event AddExamWithXp(uint256 examId, uint256 xp);
    event RemoveExamWithXp(uint256 examId);
    event UpdateExamXp(uint256 examId, uint256 xp);
    event SetExamData(
        uint256 indexed id,
        string name,
        string description,
        uint256 endTime,
        string[] questions,
        uint256 price,
        uint256 baseScore,
        string imageUrl,
        address certifier,
        uint256 maxSubmissions
    );

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error Certifier__ExamEndedOrCancelled(uint256 examId, uint256 examStatus);
    error Certifier__ExamHasNotEnded(uint256 examId, uint256 examStatus);
    error Certifier__ExamIsNotCancelled(uint256 examId, uint256 examStatus);
    error Certifier__NotTheTimeForExamCorrection(uint256 examId, uint256 examStatus);
    error Certifier__UserCannotClaimNFT(uint256 examId, uint256 userStatus);
    error Certifier__UserCannotClaimRefund(uint256 examId, uint256 userStatus);
    error Certifier__NotEnoughEther(uint256 amountSent, uint256 examPrice);
    error Certifier__EtherTransferFailed();
    error Certifier__AnswerHashesDontMatch(bytes32 submittedHashedAnswer, bytes32 expectedHashedAnswer);
    error Certifier__WrongAnswers(uint256 expected, uint256 actual);
    error Certifier__AnswersLengthDontMatch(uint256 correctAnswersLength, uint256 userAnswersLength);
    error Certifier__UserCannotSubmit(uint256 examId, uint256 userStatus);
    error Certifier__OnlyCertifierCanCorrect(uint256 examId);
    error Certifier__ThisExamIsNotPaid(uint256 examId);
    error Certifier__CertifierCannotSubmit(uint256 examId);
    error Certifier__BaseScoreExceedsNumberOfQuestions();
    error Certifier__EndTimeIsInThePast(uint256 endTime, uint256 nowTime);
    error Certifier__NameCannotBeEmpty();
    error Certifier__ContractIsPausedOrStopped();
    error Certifier__MaxSubmissionsReached(uint256 examId, uint256 maxSubmissions, uint256 numberOfsubmissions);
    error Certifier__UserIsNotVerified(address user);
    error Certifier__QuestionsCannotBeEmpty();
    error ReusedSignature();
    error InvalidSignature();
    error Certifier__VerificationAvailableOnlyOnCelo();
    error Certifier__NotOwnerOrCertifier(uint256 examId, address user, address certifier, address owner);

    // external

    /**
     * @notice Creates a new exam
     * @param name The name of the exam
     * @param description The description of the exam
     * @param endTime The time the exam ends (unix timestamp)
     * @param questions The questions of the exam
     * @param price The cost of the exam for each student
     * @param baseScore The base score of the exam
     * @param imageUrl The image url of the exam
     * @param maxSubmissions The maximum number of submissions
     */
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
    ) external payable;

    /**
     * @notice Submits the answers of the user.
     * @notice The user has to pay the price of the exam, if there is one.
     * @notice The user can only submit answers before the exam ends.
     * @notice The user can only submit answers once.
     * @param examId The id of the exam
     * @param hashedAnswer The hash of the answers and the key and msg.sender
     * @param inviter The inviter of the user
     * @param validUntilBlock The block number until which the signature is valid
     * @param signature The signature of the user
     */
    function submitAnswers(uint256 examId, bytes32 hashedAnswer, address inviter, uint256 validUntilBlock, bytes memory signature) external payable;

    /**
    * @notice Corrects the exam
    * @notice Only the certifier can call this function
    * @param examId The id of the exam
    * @param answers The answers of the user in an array
    */
    function correctExam(uint256 examId, string memory answers) external;

    /**
    * @notice Claims the NFT certificate
    * @notice The user can only claim their certificate once
    * @notice answers and secretNumber are used to get the exact answers that the user submitted and 
    * to ensure that he was the one who submitted them
    * @param examId The id of the exam
    * @param answers The answers of the user in an array
    * @param secretNumber The secret number of the user
    */
    function claimCertificate(uint256 examId, string memory answers, uint256 secretNumber) external;

    /**
    * Refund the price of the cancelled exam to the user (minus submission fee)
    * Only if the exam is paid (price > 0)
    * @param examId The id of the exam
    */
    function refundExam(uint256 examId) external;

    /**
    * @notice Sets the xp of all users to 0
    */
    function resetXpOfUsers() external;

    // public

    function tokenURI(uint256 tokenId) external view returns (string memory);

    function getUsdToEthRate(uint256 usdAmount) external view returns (uint256);

    function getIsVerifiedOnCelo(address user) external view returns (bool);

    function getHashesMatch(uint256, string memory, uint256) external view returns (bool, bytes32, bytes32);

    // getters

    function getUserScore(uint256 examId, address user) external view returns (uint256);

    function getFeeCollector() external view returns (address);

    function getCertifierExams(address certifier) external view returns (uint256[] memory);

    function getUserExams(address user) external view returns (uint256[] memory);

    function getUsers() external view returns (address[] memory);

    function getUser(uint256 index) external view returns (address);

    function getUserHashedAnswer(address user, uint256 examId) external view returns (bytes32);

    function getUserStringAnswer(address user, uint256 examId) external view returns (string memory);

    function getExam(uint256 id) external view returns (Exam memory);

    function getLastExamId() external view returns (uint256);

    function getExamCreationFee() external view returns (uint256);

    function getSubmissionFee() external view returns (uint256);

    function getTimeToCorrectExam() external view returns (uint256);

    function getTokenCounter() external view returns (uint256);

    function getUsername(address user) external view returns (string memory);

    function getUserFromUsername(string memory username) external view returns (address);

    function getDecimals() external pure returns (uint256);

    function getIsPaused() external view returns (bool);

    function getIsStopped() external view returns (bool);

    function getWhitelist() external view returns (address[] memory);

    function getUserIsWhitelisted(address user) external view returns (bool);

    function getSigner() external view returns (address);

    function getRequiresSignature() external view returns (bool);

    function getUserStatus(address user, uint256 examId) external view returns (UserStatus);

    function getUserTokenId(address user, uint256 examId) external view returns (uint256);

    function getExamsWithXp() external view returns (uint256[] memory);

    function getExamXp(uint256 examId) external view returns (uint256);

    function getUserXp(address user) external view returns (uint256);

    function getUsersWithXp() external view returns (address[] memory);

    /*//////////////////////////////////////////////////////////////
                           SETTER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function setFeeCollector(address feeCollector) external;

    function setTimeToCorrectExam(uint256 time) external;

    function setExamCreationFee(uint256 fee) external;

    function setSubmissionFee(uint256 fee) external;

    // function setUsername(string memory username, uint256 nonce, bytes memory signature) external;

    function setPaused(bool paused) external;

    function setStopped() external;

    function addToWhitelist(address user) external;

    function removeFromWhitelist(address user) external;

    function setSigner(address signer) external;

    function setRequiresSignature(bool requiresSignature) external;

    function setPriceFeed(address priceFeed) external;

    function addExamWithXp(uint256 examId, uint256 xp) external;

    function removeExamWithXp(uint256 examId) external;

    function updateExamXp(uint256 examId, uint256 xp) external;
}