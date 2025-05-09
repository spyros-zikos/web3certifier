export const defaultImage = "https://0a050602b1c1aeae1063a0c8f5a7cdac.ipfscdn.io/ipfs/Qme6b3de9ATPVjNh5mhFPwHgJUmqKz8vqYx2LPj6j3uQTY/KNOWLEDGE.png";
export const SUPPORTED_NETWORKS = [11155111, 42161, 42220];
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export interface ContractsConfig {
    [chainId: number]: {
        [contractName: string]: {
            address: string;
            abi: any;
        }
    }
}

export const certifierAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"AddressEmptyCode","type":"error"},{"inputs":[{"internalType":"bytes32","name":"submittedHashedAnswer","type":"bytes32"},{"internalType":"bytes32","name":"expectedHashedAnswer","type":"bytes32"}],"name":"Certifier__AnswerHashesDontMatch","type":"error"},{"inputs":[{"internalType":"uint256","name":"correctAnswersLength","type":"uint256"},{"internalType":"uint256","name":"userAnswersLength","type":"uint256"}],"name":"Certifier__AnswersLengthDontMatch","type":"error"},{"inputs":[],"name":"Certifier__BaseScoreExceedsNumberOfQuestions","type":"error"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"}],"name":"Certifier__CertifierCannotSubmit","type":"error"},{"inputs":[],"name":"Certifier__ContractIsPausedOrStopped","type":"error"},{"inputs":[{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"uint256","name":"nowTime","type":"uint256"}],"name":"Certifier__EndTimeIsInThePast","type":"error"},{"inputs":[],"name":"Certifier__EtherTransferFailed","type":"error"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"uint256","name":"examStatus","type":"uint256"}],"name":"Certifier__ExamEndedOrCancelled","type":"error"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"uint256","name":"examStatus","type":"uint256"}],"name":"Certifier__ExamHasNotEnded","type":"error"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"uint256","name":"examStatus","type":"uint256"}],"name":"Certifier__ExamIsNotCancelled","type":"error"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"uint256","name":"maxSubmissions","type":"uint256"},{"internalType":"uint256","name":"numberOfsubmissions","type":"uint256"}],"name":"Certifier__MaxSubmissionsReached","type":"error"},{"inputs":[],"name":"Certifier__NameCannotBeEmpty","type":"error"},{"inputs":[{"internalType":"uint256","name":"amountSent","type":"uint256"},{"internalType":"uint256","name":"examPrice","type":"uint256"}],"name":"Certifier__NotEnoughEther","type":"error"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"uint256","name":"examStatus","type":"uint256"}],"name":"Certifier__NotTheTimeForExamCorrection","type":"error"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"}],"name":"Certifier__OnlyCertifierCanCorrect","type":"error"},{"inputs":[],"name":"Certifier__QuestionsCannotBeEmpty","type":"error"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"}],"name":"Certifier__ThisExamIsNotPaid","type":"error"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"uint256","name":"userStatus","type":"uint256"}],"name":"Certifier__UserCannotClaimNFT","type":"error"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"uint256","name":"userStatus","type":"uint256"}],"name":"Certifier__UserCannotClaimRefund","type":"error"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"uint256","name":"userStatus","type":"uint256"}],"name":"Certifier__UserCannotSubmit","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"Certifier__UserIsNotVerified","type":"error"},{"inputs":[],"name":"Certifier__VerificationAvailableOnlyOnCelo","type":"error"},{"inputs":[{"internalType":"uint256","name":"expected","type":"uint256"},{"internalType":"uint256","name":"actual","type":"uint256"}],"name":"Certifier__WrongAnswers","type":"error"},{"inputs":[{"internalType":"address","name":"implementation","type":"address"}],"name":"ERC1967InvalidImplementation","type":"error"},{"inputs":[],"name":"ERC1967NonPayable","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721IncorrectOwner","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721InsufficientApproval","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC721InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"ERC721InvalidOperator","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721InvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC721InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC721InvalidSender","type":"error"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721NonexistentToken","type":"error"},{"inputs":[],"name":"FailedCall","type":"error"},{"inputs":[],"name":"InvalidInitialization","type":"error"},{"inputs":[],"name":"InvalidSignature","type":"error"},{"inputs":[],"name":"NotInitializing","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[],"name":"ReentrancyGuardReentrantCall","type":"error"},{"inputs":[],"name":"ReusedSignature","type":"error"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"}],"name":"StringsInsufficientHexLength","type":"error"},{"inputs":[],"name":"UUPSUnauthorizedCallContext","type":"error"},{"inputs":[{"internalType":"bytes32","name":"slot","type":"bytes32"}],"name":"UUPSUnsupportedProxiableUUID","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"}],"name":"AddeToWhitelist","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"examId","type":"uint256"},{"indexed":false,"internalType":"string","name":"answers","type":"string"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ClaimNFT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"examId","type":"uint256"},{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ClaimRefund","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"examId","type":"uint256"},{"indexed":false,"internalType":"string","name":"answers","type":"string"},{"indexed":false,"internalType":"uint256","name":"etherAccumulated","type":"uint256"}],"name":"CorrectExam","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"uint256","name":"endTime","type":"uint256"},{"indexed":false,"internalType":"string[]","name":"questions","type":"string[]"},{"indexed":false,"internalType":"string","name":"answers","type":"string"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"baseScore","type":"uint256"},{"indexed":false,"internalType":"string","name":"imageUrl","type":"string"},{"indexed":false,"internalType":"address[]","name":"users","type":"address[]"},{"indexed":false,"internalType":"uint256","name":"etherAccumulated","type":"uint256"},{"indexed":false,"internalType":"address","name":"certifier","type":"address"},{"indexed":false,"internalType":"uint256","name":"maxSubmissions","type":"uint256"},{"indexed":false,"internalType":"bool","name":"userClaimsWithPassword","type":"bool"}],"name":"CreateExam","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint64","name":"version","type":"uint64"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"}],"name":"RemoveFromWhitelist","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"}],"name":"SetExamCreationFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"feeCollector","type":"address"}],"name":"SetFeeCollector","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"paused","type":"bool"}],"name":"SetPaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"priceFeed","type":"address"}],"name":"SetPriceFeed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"requiresSignature","type":"bool"}],"name":"SetRequiresSignature","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"signer","type":"address"}],"name":"SetSigner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"}],"name":"SetSubmissionFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"SetTimeToCorrectExam","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"string","name":"username","type":"string"}],"name":"SetUsername","type":"event"},{"anonymous":false,"inputs":[],"name":"Stopped","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"examId","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"hashedAnswer","type":"bytes32"}],"name":"SubmitAnswers","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"examId","type":"uint256"},{"indexed":false,"internalType":"string","name":"answers","type":"string"}],"name":"UserFailed","type":"event"},{"inputs":[],"name":"UPGRADE_INTERFACE_VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"addToWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"string","name":"answers","type":"string"},{"internalType":"uint256","name":"secretNumber","type":"uint256"}],"name":"claimCertificate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"string","name":"answers","type":"string"}],"name":"correctExam","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"string[]","name":"questions","type":"string[]"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"baseScore","type":"uint256"},{"internalType":"string","name":"imageUrl","type":"string"},{"internalType":"uint256","name":"maxSubmissions","type":"uint256"},{"internalType":"bool","name":"userClaimsWithPassword","type":"bool"}],"name":"createExam","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"certifier","type":"address"}],"name":"getCertifierExams","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDecimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getExam","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"string[]","name":"questions","type":"string[]"},{"internalType":"string","name":"answers","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"baseScore","type":"uint256"},{"internalType":"string","name":"imageUrl","type":"string"},{"internalType":"address[]","name":"users","type":"address[]"},{"internalType":"uint256","name":"etherAccumulated","type":"uint256"},{"internalType":"address","name":"certifier","type":"address"},{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"},{"internalType":"uint256","name":"maxSubmissions","type":"uint256"},{"internalType":"uint256","name":"numberOfSubmissions","type":"uint256"},{"internalType":"bool","name":"userClaimsWithPassword","type":"bool"}],"internalType":"struct ICertifier.Exam","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getExamCreationFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"}],"name":"getExamStatus","outputs":[{"internalType":"enum ICertifier.ExamStatus","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFeeCollector","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"string","name":"answers","type":"string"},{"internalType":"uint256","name":"secretNumber","type":"uint256"}],"name":"getHashesMatch","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getIsPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getIsStopped","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getIsVerifiedOnCelo","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLastExamId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRequiresSignature","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSigner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSubmissionFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTimeToCorrectExam","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTokenCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"usdAmount","type":"uint256"}],"name":"getUsdToEthRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getUser","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserExams","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"username","type":"string"}],"name":"getUserFromUsername","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"examId","type":"uint256"}],"name":"getUserHashedAnswer","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserIsWhitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"getUserScore","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"examId","type":"uint256"}],"name":"getUserStatus","outputs":[{"internalType":"enum ICertifier.UserStatus","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"examId","type":"uint256"}],"name":"getUserStringAnswer","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"examId","type":"uint256"}],"name":"getUserTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUsername","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUsers","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getWhitelist","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"priceFeed","type":"address"},{"internalType":"uint256","name":"timeToCorrectExam","type":"uint256"},{"internalType":"uint256","name":"examCreationFee","type":"uint256"},{"internalType":"uint256","name":"submissionFee","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"}],"name":"refundExam","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"removeFromWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"fee","type":"uint256"}],"name":"setExamCreationFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"feeCollector","type":"address"}],"name":"setFeeCollector","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"paused","type":"bool"}],"name":"setPaused","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"priceFeed","type":"address"}],"name":"setPriceFeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"requiresSignature","type":"bool"}],"name":"setRequiresSignature","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"signer","type":"address"}],"name":"setSigner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setStopped","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"fee","type":"uint256"}],"name":"setSubmissionFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"setTimeToCorrectExam","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"username","type":"string"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"setUsername","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"bytes32","name":"hashedAnswer","type":"bytes32"}],"name":"submitAnswers","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}];

export const rewardFactoryAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"AddressEmptyCode","type":"error"},{"inputs":[{"internalType":"address","name":"implementation","type":"address"}],"name":"ERC1967InvalidImplementation","type":"error"},{"inputs":[],"name":"ERC1967NonPayable","type":"error"},{"inputs":[],"name":"FailedCall","type":"error"},{"inputs":[],"name":"InvalidInitialization","type":"error"},{"inputs":[],"name":"NotInitializing","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[],"name":"ReentrancyGuardReentrantCall","type":"error"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"}],"name":"RewardFactory__RewardAlreadyExists","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"certifier","type":"address"}],"name":"RewardFactory__UserIsNotCertifier","type":"error"},{"inputs":[],"name":"UUPSUnauthorizedCallContext","type":"error"},{"inputs":[{"internalType":"bytes32","name":"slot","type":"bytes32"}],"name":"UUPSUnsupportedProxiableUUID","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"examId","type":"uint256"},{"indexed":false,"internalType":"address","name":"reward","type":"address"},{"indexed":false,"internalType":"uint256","name":"initialRewardAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rewardAmountPerPerson","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rewardAmountPerCorrectAnswer","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"}],"name":"CreateReward","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint64","name":"version","type":"uint64"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"examId","type":"uint256"}],"name":"RemoveReward","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"inputs":[],"name":"UPGRADE_INTERFACE_VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"uint256","name":"initialRewardAmount","type":"uint256"},{"internalType":"uint256","name":"rewardAmountPerPerson","type":"uint256"},{"internalType":"uint256","name":"rewardAmountPerCorrectAnswer","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"createReward","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getCertifierContractAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getReward","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"}],"name":"getRewardByExamId","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRewards","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"certifierContractAddress","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"examId","type":"uint256"}],"name":"removeReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}];

export const rewardAbi = [{"inputs":[{"internalType":"address","name":"certifier","type":"address"},{"internalType":"uint256","name":"examId","type":"uint256"},{"internalType":"uint256","name":"initialRewardAmount","type":"uint256"},{"internalType":"uint256","name":"rewardAmountPerPerson","type":"uint256"},{"internalType":"uint256","name":"rewardAmountPerCorrectAnswer","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"Reward__UserAlreadyClaimed","type":"error"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"Reward__UserDidNotSucceed","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Reward__Claim","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Reward__Fund","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"certifier","type":"address"},{"indexed":false,"internalType":"uint256","name":"examId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"initialRewardAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rewardAmountPerPerson","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"address","name":"factory","type":"address"}],"name":"Reward__NewReward","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Reward__Withdraw","type":"event"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"fund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getCertifierContractAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getExamId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFactory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getRewardAmountForUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRewardAmountPerCorrectAnswer","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRewardAmountPerPerson","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserHasClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserHasSucceeded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUsersThatClaimed","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rewardAmountPerCorrectAnswer","type":"uint256"}],"name":"setRewardAmountPerCorrectAnswer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"rewardAmountPerPerson","type":"uint256"}],"name":"setRewardAmountPerPerson","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

export const erc20Abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]

export const chainsToContracts: ContractsConfig = {
    11155111: {
        Certifier: {address:"0x9d6563b1188a482bF8d391a001f343169D3D6cCC", abi: certifierAbi},
        RewardFactory: {address:"0x8f5ed4371E339D75053d5E0ac6e7b629c4626619", abi: rewardFactoryAbi},
        Reward: {address:"", abi: rewardAbi},
        ERC20: {address:"", abi: erc20Abi},
    },
    42161: {
        Certifier: {address:"0x6711893cd7b41552D74CeBbEc8e93773a5E9Ac66", abi: certifierAbi},
        RewardFactory: {address:"0x8f5ed4371E339D75053d5E0ac6e7b629c4626619", abi: rewardFactoryAbi},
        Reward: {address:"", abi: rewardAbi},
        ERC20: {address:"", abi: erc20Abi},
    },
    42220: {
        Certifier: {address:"0xEdA52212b4BE0EB74aef879e714E4f722EA263A0", abi: certifierAbi},
        RewardFactory: {address:"0x8f5ed4371E339D75053d5E0ac6e7b629c4626619", abi: rewardFactoryAbi},
        Reward: {address:"", abi: rewardAbi},
        ERC20: {address:"", abi: erc20Abi},
    },
}