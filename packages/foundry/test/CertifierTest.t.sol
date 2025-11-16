// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";

import {Certifier} from "../contracts/Certifier.sol";
import {RewardFactory} from "../contracts/RewardFactory.sol";
import {Reward} from "../contracts/Reward.sol";
import {ICertifier} from "../contracts/interfaces/ICertifier.sol";
import {DeployCertifierProxy} from "../script/Certifier/DeployCertifierProxy.s.sol";
import {MockToken} from "./mocks/MockToken.sol";

import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CertifierTest is Test {
    Certifier public certifier;
    RewardFactory public rewardFactory;
    IERC20 public token;
    uint256 constant TIME_DURATION = 100;
    uint256 constant EXAM_PRICE = 3 ether;  // $3
    uint256 constant USER_INITIAL_BALANCE = 1000 ether;
    uint256 constant ORG_INITIAL_BALANCE = 1000 ether;
    uint256 constant INITIAL_TOKEN_SUPPLY = 1000 ether;
    uint256 constant REWARD_INITIAL_AMOUNT = 2 ether;
    uint256 constant REWARD_FUND_AMOUNT = 1 ether;
    string[] public examQuestions;

    address user = makeAddr("user");
    address user2 = makeAddr("user2");
    address certifierOrg = makeAddr("certifierOrg");
    address verifiedUser = vm.envAddress("VERIFIED_1");
    address verifiedUser2 = vm.envAddress("VERIFIED_2");
    address verifiedOrg = vm.envAddress("VERIFIED_3");
    address deployer;
    uint256 deployerKey;

    modifier onlyCelo() {
        if (block.chainid != 42220) return;
        _;
    }

    modifier notCelo() {
        if (block.chainid == 42220) return;
        _;
    }

    function setUp() public {
        (deployer, deployerKey) = makeAddrAndKey("deployer");
        vm.startPrank(deployer);

        // Deploy certifier contract
        DeployCertifierProxy deployCertifierProxy = new DeployCertifierProxy();
        ERC1967Proxy certifierProxy = new ERC1967Proxy(address(new Certifier()), ""); // empty initializer
        Certifier(address(certifierProxy)).initialize(
            deployCertifierProxy.priceFeed(), deployCertifierProxy.TIME_TO_CORRECT(), deployCertifierProxy.EXAM_CREATION_FEE(), deployCertifierProxy.SUBMISSION_FEE()
        );
        address certifierProxyAddress = address(certifierProxy);
        certifier = Certifier(certifierProxyAddress);

        // Deploy reward factory contract
        // proxy
        ERC1967Proxy rewardFactoryProxy = new ERC1967Proxy(address(new RewardFactory()), ""); // empty initializer
        // initialize
        RewardFactory(address(rewardFactoryProxy)).initialize(certifierProxyAddress);
        // address
        address rewardFactoryProxyAddress = address(rewardFactoryProxy);
        // proxy with abi of implementation
        rewardFactory = RewardFactory(rewardFactoryProxyAddress);

        // Deploy token contract
        token = new MockToken(certifierOrg, INITIAL_TOKEN_SUPPLY);
        vm.stopPrank();

        examQuestions.push("question1");
        examQuestions.push("question2");
        examQuestions.push("question3");
        vm.deal(user, USER_INITIAL_BALANCE);
        vm.deal(user2, USER_INITIAL_BALANCE);
        vm.deal(certifierOrg, ORG_INITIAL_BALANCE);
        vm.deal(verifiedUser, USER_INITIAL_BALANCE);
        vm.deal(verifiedUser2, USER_INITIAL_BALANCE);
        vm.deal(verifiedOrg, ORG_INITIAL_BALANCE);
    }

    function testCreateExamSubmitAnswersCorrectExamClaimNFTClaimReward() public notCelo {
        // Arrange
        // Act
        // Assert
        orgCreatesExam(certifierOrg, false);
        // Set xp of exam 1 to 10 and exam 2 to 20
        vm.startPrank(deployer);
        certifier.addExamWithXp(0, 10);
        certifier.addExamWithXp(1, 20);
        vm.stopPrank();

        uint256 examId = 0;
        string memory userAnswers = "112";
        uint256 secretNumber = 123;
        bytes32 hashedAnswer = keccak256(abi.encodePacked(userAnswers, secretNumber, user));
        assert(certifier.getExamStatus(examId) == ICertifier.ExamStatus.Open);
        // User submits
        uint256 submissionFeeInEth = certifier.getUsdToEthRate(certifier.getExam(examId).price);
        vm.prank(user);
        certifier.submitAnswers{value: submissionFeeInEth}(examId, hashedAnswer, address(0), 0, "0x");

        console2.log("3");
        vm.warp(block.timestamp + TIME_DURATION + 1);
        string memory correctAnswers = "112";

        assert(certifier.getExamStatus(examId) == ICertifier.ExamStatus.UnderCorrection);
        // Org corrects
        vm.prank(certifierOrg);
        certifier.correctExam(examId, correctAnswers);

        assert(certifier.getExamStatus(examId) == ICertifier.ExamStatus.Corrected);
        // User claims
        vm.prank(user);
        certifier.claimCertificate(examId, userAnswers, secretNumber);

        // NFT metadata
        console2.log(certifier.tokenURI(0));

        vm.prank(certifierOrg);
        token.approve(address(rewardFactory), REWARD_INITIAL_AMOUNT);

        // Org creates a reward
        vm.startPrank(certifierOrg);
        address reward = rewardFactory.createReward(
            examId,
            REWARD_INITIAL_AMOUNT, // initialRewardAmount,
            address(token), // rewardToken
            RewardFactory.DistributionType.CONSTANT, // distributionType,
            5, // distributionParameter,
            RewardFactory.EligibilityCriteria.NONE, // eligibilityCriteria,
            address(0) // eligibilityParameter,
        );
        vm.stopPrank();

        // User claims reward
        vm.startPrank(user);
        Reward(reward).claim();
        vm.stopPrank();

        assert(token.balanceOf(user) == 5);

        // Certifier funds reward
        vm.startPrank(certifierOrg);
        token.approve(reward, REWARD_FUND_AMOUNT);
        Reward(reward).fund(REWARD_FUND_AMOUNT);
        vm.stopPrank();

        assert(token.balanceOf(certifierOrg) == INITIAL_TOKEN_SUPPLY - REWARD_INITIAL_AMOUNT - REWARD_FUND_AMOUNT);

        // Certifier withdraws reward
        vm.startPrank(certifierOrg);
        Reward(reward).withdraw();
        vm.stopPrank();

        assert(token.balanceOf(certifierOrg) == INITIAL_TOKEN_SUPPLY - token.balanceOf(user));

        ///// XP /////
        // create exam, submit, correct, claim, CHECK XP
        orgCreatesExam(certifierOrg, false);
        uint256 examId2 = 1;
        string memory userAnswers2 = "112";
        uint256 secretNumber2 = 123;
        bytes32 hashedAnswer2 = keccak256(abi.encodePacked(userAnswers2, secretNumber2, user));
        bytes32 hashedAnswer2ForUser2 = keccak256(abi.encodePacked(userAnswers2, secretNumber2, user2));
        // User submits
        uint256 submissionFeeInEth2 = certifier.getUsdToEthRate(certifier.getExam(examId2).price);
        vm.prank(user);
        certifier.submitAnswers{value: submissionFeeInEth2}(examId2, hashedAnswer2, address(0), 0, "0x");
        // User2 submits
        vm.prank(user2);
        certifier.submitAnswers{value: submissionFeeInEth2}(examId2, hashedAnswer2ForUser2, address(0), 0, "0x");
        vm.warp(block.timestamp + TIME_DURATION + 1);
        // Org corrects
        vm.prank(certifierOrg);
        certifier.correctExam(examId2, userAnswers2);
        // User claims
        vm.prank(user);
        certifier.claimCertificate(examId2, userAnswers2, secretNumber2);
        // User2 claims
        vm.prank(user2);
        certifier.claimCertificate(examId2, userAnswers2, secretNumber2);


        // Check user xp
        assert(certifier.getUserXp(user) == 30);
        assert(certifier.getUserXp(user2) == 20);

        // remove xp from exam 1
        vm.prank(deployer);
        certifier.removeExamWithXp(1);

        // Check user xp
        assert(certifier.getUserXp(user) == 30);
        assert(certifier.getUserXp(user2) == 20);
        assert(certifier.getUsersWithXp().length == 2);

        // reset user xp
        vm.prank(deployer);
        certifier.resetXpOfUsers();

        // Check user xp
        assert(certifier.getUserXp(user) == 0);
        assert(certifier.getUserXp(user2) == 0);
        assert(certifier.getUsersWithXp().length == 0);
    }

    function testXp() public {
        // add an exam with 10 xp
        vm.startPrank(deployer);
        certifier.addExamWithXp(1, 10);
        console2.log("After adding exam 1 with 10 xp: ");
        for (uint256 i = 0; i < certifier.getExamsWithXp().length; i++)
            console2.log(certifier.getExamsWithXp()[i]);
        assert(certifier.getExamXp(1) == 10);

        // add an exam with 20 xp
        certifier.addExamWithXp(2, 20);
        console2.log("After adding exam 2 with 20 xp: ");
        for (uint256 i = 0; i < certifier.getExamsWithXp().length; i++)
            console2.log(certifier.getExamsWithXp()[i]);
        assert(certifier.getExamXp(2) == 20);

        // update the xp of the exam 1 to 15
        certifier.updateExamXp(1, 15);
        console2.log("After updating xp of exam 1 to 15, the xp of the exam 1 is: ");
        console2.log(certifier.getExamXp(1));
        assert(certifier.getExamXp(1) == 15);

        // remove xp from the exam 1
        certifier.removeExamWithXp(1);
        console2.log("After removing xp from exam 1: ");
        for (uint256 i = 0; i < certifier.getExamsWithXp().length; i++)
            console2.log(certifier.getExamsWithXp()[i]);
        assert(certifier.getExamXp(1) == 0);

        // remove xp from the exam 2
        certifier.removeExamWithXp(2);
        console2.log("After removing xp from exam 2: ");
        for (uint256 i = 0; i < certifier.getExamsWithXp().length; i++)
            console2.log(certifier.getExamsWithXp()[i]);
        assert(certifier.getExamXp(2) == 0);
    }

    function _testCreateExamSubmitAnswersGetRefund() public notCelo {
        orgCreatesExam(certifierOrg, false);
        
        uint256 examId = 0;
        uint256 userAnswersAsNumber = 111;
        uint256 secretNumber = 123;
        bytes32 hashedAnswer = keccak256(abi.encodePacked(userAnswersAsNumber, secretNumber, user));
        assert(certifier.getExamStatus(examId) == ICertifier.ExamStatus.Open);
        // User submits
        uint256 submissionFeeInEth = certifier.getUsdToEthRate(certifier.getExam(examId).price);
        vm.prank(user);
        certifier.submitAnswers{value: submissionFeeInEth}(examId, hashedAnswer, address(0), 0, "0x");

        // User2 submits
        vm.prank(user2);
        certifier.submitAnswers{value: submissionFeeInEth}(examId, hashedAnswer, address(0), 0, "0x");

        vm.warp(block.timestamp + TIME_DURATION + certifier.getTimeToCorrectExam() + 1);
        assert(certifier.getExamStatus(examId) == ICertifier.ExamStatus.Cancelled);
        // User claims
        vm.expectEmit(false, false, false, true);
        emit ICertifier.ClaimRefund(examId, user, certifier.getExam(examId).etherAccumulated/2);
        vm.prank(user);
        certifier.refundExam(examId);

        // User2 claims
        vm.expectEmit(false, false, false, true);
        emit ICertifier.ClaimRefund(examId, user2, certifier.getExam(examId).etherAccumulated/2);
        vm.prank(user2);
        certifier.refundExam(examId);
    }

    function _testWhiteListedUserCreateExam() public notCelo {
        vm.startPrank(deployer);
        certifier.addToWhitelist(certifierOrg);
        vm.stopPrank();

        vm.startPrank(certifierOrg);
        certifier.createExam{value: 0}(
            "Test Name",
            "Test Description",
            block.timestamp + TIME_DURATION,
            examQuestions,
            EXAM_PRICE,
            2,  // base score
            "THEIMAGE",
            2,  // max submissions
            false
        );
        vm.stopPrank();
        
        uint256 examId = 0;
        uint256 userAnswersAsNumber = 111;
        uint256 secretNumber = 123;
        bytes32 hashedAnswer = keccak256(abi.encodePacked(userAnswersAsNumber, secretNumber, user));
        // User submits
        uint256 submissionFeeInEth = certifier.getUsdToEthRate(certifier.getExam(examId).price);
        vm.prank(user);
        certifier.submitAnswers{value: submissionFeeInEth}(examId, hashedAnswer, address(0), 0, "0x");
    }

    function _testUsername() public notCelo {
        vm.prank(user);
        certifier.setUsername("username", 0, "0x");
        assert(keccak256(abi.encode("username")) == keccak256(abi.encode(certifier.getUsername(user))));

        vm.prank(deployer);
        certifier.setRequiresSignature(true);

        vm.expectRevert();
        vm.prank(user);
        certifier.setUsername("username2", 0, "0x");

        vm.prank(user);
        certifier.setUsername("username2", 0, signTokenNum("username2", 0, user));
    }

    function _testVerifiedExamCreationAndSubmission() public onlyCelo {
        // Unverified creates exam
        orgCreatesExam(certifierOrg, true);
        // Verified creates exam
        orgCreatesExam(verifiedOrg, false);

        uint256 examId = 0;
        uint256 userAnswersAsNumber = 111;
        uint256 secretNumber = 123;
        bytes32 hashedAnswer = keccak256(abi.encodePacked(userAnswersAsNumber, secretNumber, user));

        uint256 submissionFeeInEth = certifier.getUsdToEthRate(certifier.getExam(examId).price);
        // Unverified submits
        vm.expectRevert();
        vm.prank(user);
        certifier.submitAnswers{value: submissionFeeInEth}(examId, hashedAnswer, address(0), 0, "0x");

        // Verified submits
        vm.prank(verifiedUser);
        certifier.submitAnswers{value: submissionFeeInEth}(examId, hashedAnswer, address(0), 0, "0x");
    }

    function _testWhitelist() public {
        vm.startPrank(deployer);

        // add 0x1
        certifier.addToWhitelist(address(0x1));
        console2.log("Is whitelisted: ", certifier.getUserIsWhitelisted(address(0x1)));
        console2.log("Whitelist: ");
        for (uint256 i = 0; i < certifier.getWhitelist().length; i++) console2.log(certifier.getWhitelist()[i]);

        // add 0x2
        certifier.addToWhitelist(address(0x2));
        console2.log("Is whitelisted: ", certifier.getUserIsWhitelisted(address(0x2)));
        console2.log("Whitelist: ");
        for (uint256 i = 0; i < certifier.getWhitelist().length; i++) console2.log(certifier.getWhitelist()[i]);

        // remove 0x1
        certifier.removeFromWhitelist(address(0x1));
        console2.log("Is whitelisted: ", certifier.getUserIsWhitelisted(address(0x1)));
        console2.log("Whitelist: ");
        for (uint256 i = 0; i < certifier.getWhitelist().length; i++) console2.log(certifier.getWhitelist()[i]);

        // remove 0x2
        certifier.removeFromWhitelist(address(0x2));
        console2.log("Is whitelisted: ", certifier.getUserIsWhitelisted(address(0x2)));
        console2.log("Whitelist: ");
        for (uint256 i = 0; i < certifier.getWhitelist().length; i++) console2.log(certifier.getWhitelist()[i]);

        vm.stopPrank();
    }

    // helpers
    function orgCreatesExam(address org, bool reverts) public {
        uint256 creationFeeInEth = certifier.getUsdToEthRate(certifier.getExamCreationFee());
        console2.log("creationFeeInEth: ", creationFeeInEth);
        if (reverts) vm.expectRevert();
        vm.startPrank(org);
        certifier.createExam{value: creationFeeInEth}(
            "Test Name",
            "Test Description",
            block.timestamp + TIME_DURATION,
            examQuestions,
            EXAM_PRICE,
            2,  // base score
            "THEIMAGE",
            2,  // max submissions
            false
        );
        vm.stopPrank();
    }

    function signTokenNum(string memory username, uint256 nonce, address userAddress) private view returns (bytes memory) {
        // create digest: keccak256 gives us the first 32bytes after doing the hash
        // so this is always 32 bytes.
        // bytes32 digest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32",
        //                                             bytes32(uint256(uint160(adin))), 
        //                                             bytes32(ticketNum))
        // );

        bytes32 message = keccak256(abi.encodePacked(username, nonce, address(certifier), block.chainid, userAddress));

        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(message);

        // r and s are the outputs of the ECDSA signature
        // r,s and v are packed into the signature. It should be 65 bytes: 32 + 32 + 1
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(deployerKey, digest);

        // pack v, r, s into 65bytes signature
        // bytes memory signature = abi.encodePacked(r, s, v);
        return abi.encodePacked(r, s, v);
    }
}
