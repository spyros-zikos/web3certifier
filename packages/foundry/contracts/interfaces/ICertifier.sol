// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface ICertifier {
    
    /*//////////////////////////////////////////////////////////////
                           TYPE DECLARATIONS
    //////////////////////////////////////////////////////////////*/
    
    enum Status {
        Started,
        NeedsCorrection,  // not used in contract, only externally
        Cancelled,  // not used in contract, only externally
        Ended
    }

    struct Exam {
        uint256 id;
        string name;
        string description;
        uint256 endTime;
        string[] questions;
        uint256[] answers;
        uint256 price; // in $
        uint256 baseScore;
        string imageUrl;
        address[] users;
        uint256 etherAccumulated;
        address certifier;
        uint256[] tokenIds;
        uint256 maxSubmissions;
        uint256 numberOfSubmissions;
        bool userClaimsWithPassword;
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
        uint256[] answers,
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
    event CorrectExam(uint256 examId, uint256[] answers);
    event ClaimNFT(address user, uint256 examId, uint256 tokenId);
    event ClaimRefund(uint256 examId, address user);
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

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error Certifier__ExamEndedOrCancelled(uint256 examId, uint256 status);
    error Certifier__ExamHasNotEnded(uint256 examId, uint256 status);
    error Certifier__ExamIsNotCancelled(uint256 examId, uint256 status);
    error Certifier__NotTheTimeForExamCorrection(uint256 examId, uint256 status);
    error Certifier__UserAlreadyClaimedNFT(uint256 examId);
    error Certifier__UserAlreadyClaimedCancelledExam(uint256 examId);
    error Certifier__NotEnoughEther(uint256 amountSent, uint256 examPrice);
    error Certifier__EtherTransferFailed();
    error Certifier__AnswerHashesDontMatch(bytes32 expected, bytes32 actual);
    error Certifier__WrongAnswers(uint256 expected, uint256 actual);
    error Certifier__AnswersLengthDontMatch(uint256 correctAnswersLength, uint256 userAnswersLength);
    error Certifier__UserDidNotParticipate(uint256 examId);
    error Certifier__UserAlreadySubmittedAnswers(uint256 examId);
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
    
    // external

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

    function submitAnswers(uint256 examId, bytes32 hashedAnswer) external payable;

    function correctExam(uint256 examId, uint256[] memory answers) external;

    function claimCertificate(uint256 examId, uint256[] memory answers, uint256 secretNumber) external returns (bool);

    function refundExam(uint256 examId) external;

    // public

    function tokenURI(uint256 tokenId) external view returns (string memory);

    function getUsdToEthRate(uint256 usdAmount) external view returns (uint256);

    // getters
    
    function getStatus(uint256 examId) external view returns (Status);

    function getFeeCollector() external view returns (address);

    function getCertifierExams(address certifier) external view returns (uint256[] memory);

    function getUsers() external view returns (address[] memory);

    function getUser(uint256 index) external view returns (address);

    function getUserAnswer(address user, uint256 examId) external view returns (bytes32);

    function getUserHasClaimed(address user, uint256 examId) external view returns (bool);

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

    function getIsVerifiedOnCelo(address user) external view returns (bool);

    // setters

    function setFeeCollector(address feeCollector) external;

    function setTimeToCorrectExam(uint256 time) external;

    function setExamCreationFee(uint256 fee) external;

    function setSubmissionFee(uint256 fee) external;

    function setUsername(string memory username, uint256 nonce, bytes memory signature) external;

    function setPaused(bool paused) external;

    function setStopped() external;

    function addToWhitelist(address user) external;

    function removeFromWhitelist(address user) external;

    function setSigner(address signer) external;

    function setRequiresSignature(bool requiresSignature) external;

    function setPriceFeed(address priceFeed) external;
}