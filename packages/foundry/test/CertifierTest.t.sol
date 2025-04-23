// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {Certifier} from "../contracts/Certifier.sol";
import {ICertifier} from "../contracts/interfaces/ICertifier.sol";
import {DeployProxy} from "../script/DeployProxy.s.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract CertifierTest is Test {
    Certifier public certifier;
    uint256 constant TIME_DURATION = 100;
    uint256 constant EXAM_PRICE = 3 ether;  // $3
    uint256 constant USER_INITIAL_BALANCE = 10 ether;
    uint256 constant ORG_INITIAL_BALANCE = 10 ether;
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
        DeployProxy deployProxy = new DeployProxy();
        (address proxy,) = deployProxy.run();
        certifier = Certifier(address(proxy));
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

    function testCreateExamSubmitAnswersCorrectExamClaimNFT() public notCelo {
        // Arrange
        // Act
        // Assert

        // vm.startPrank(deployer);
        // certifier.setExamCreationFee(0);
        // vm.stopPrank();
        orgCreatesExam(certifierOrg, false);

        uint256 examId = 0;
        uint256 userAnswersAsNumber = 111;
        uint256 secretNumber = 123;
        bytes32 hashedAnswer = keccak256(abi.encodePacked(userAnswersAsNumber, secretNumber, user));
        assert(certifier.getStatus(examId) == ICertifier.Status.Started);
        // User submits
        uint256 submissionFeeInEth = certifier.getUsdToEthRate(certifier.getExam(examId).price);
        vm.prank(user);
        certifier.submitAnswers{value: submissionFeeInEth}(examId, hashedAnswer);

        vm.warp(block.timestamp + TIME_DURATION + 1);
        uint256[] memory answers = new uint256[](3);
        answers[0] = 1;
        answers[1] = 1;
        answers[2] = 1;

        assert(certifier.getStatus(examId) == ICertifier.Status.NeedsCorrection);
        // Org corrects
        vm.prank(certifierOrg);
        certifier.correctExam(examId, answers);

        assert(certifier.getStatus(examId) == ICertifier.Status.Ended);
        // User claims
        vm.prank(user);
        certifier.claimCertificate(examId, answers, secretNumber);

        console2.log(certifier.tokenURI(0));
        console2.log("\n--> insert the above thing in the browser url");
    }

    function testCreateExamSubmitAnswersGetRefund() public notCelo {
        orgCreatesExam(certifierOrg, false);
        
        uint256 examId = 0;
        uint256 userAnswersAsNumber = 111;
        uint256 secretNumber = 123;
        bytes32 hashedAnswer = keccak256(abi.encodePacked(userAnswersAsNumber, secretNumber, user));
        assert(certifier.getStatus(examId) == ICertifier.Status.Started);
        // User submits
        uint256 submissionFeeInEth = certifier.getUsdToEthRate(certifier.getExam(examId).price);
        vm.prank(user);
        certifier.submitAnswers{value: submissionFeeInEth}(examId, hashedAnswer);

        // User2 submits
        vm.prank(user2);
        certifier.submitAnswers{value: submissionFeeInEth}(examId, hashedAnswer);

        vm.warp(block.timestamp + TIME_DURATION + certifier.getTimeToCorrectExam() + 1);
        assert(certifier.getStatus(examId) == ICertifier.Status.Cancelled);
        // User claims
        vm.expectEmit(false, false, false, true);
        emit ICertifier.ClaimRefund(examId, user);
        vm.prank(user);
        certifier.refundExam(examId);

        // User2 claims
        vm.expectEmit(false, false, false, true);
        emit ICertifier.ClaimRefund(examId, user2);
        vm.prank(user2);
        certifier.refundExam(examId);
    }

    function testWhitelist() public {
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

    function testWhiteListedUserCreateExam() public notCelo {
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
        certifier.submitAnswers{value: submissionFeeInEth}(examId, hashedAnswer);
    }

    function testVerifiedExamCreationAndSubmission() public onlyCelo {
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
        certifier.submitAnswers{value: submissionFeeInEth}(examId, hashedAnswer);

        // Verified submits
        vm.prank(verifiedUser);
        certifier.submitAnswers{value: submissionFeeInEth}(examId, hashedAnswer);
    }

    function testUsername() public {
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

    // helpers
    function orgCreatesExam(address org, bool reverts) public {
        uint256 creationFeeInEth = certifier.getUsdToEthRate(certifier.getExamCreationFee());
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
