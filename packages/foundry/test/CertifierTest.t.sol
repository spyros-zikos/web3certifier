// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {Test, console} from "forge-std/Test.sol";
import {Certifier, Exam} from "../contracts/Certifier.sol";

contract CertifierTest is Test {
    Certifier public certifier;
    uint256 constant TIME_TO_CORRECT_EXAM = 10;
    uint256 constant TIME_DURATION = 100;
    uint256 constant EXAM_PRICE = 0.1 ether;
    uint256 constant USER_INITIAL_BALANCE = 10 ether;
    string[] public examQuestions;

    address user = makeAddr("user");
    address certifierOrg = makeAddr("certifierOrg");

    function setUp() public {
        certifier = new Certifier(TIME_TO_CORRECT_EXAM);
        examQuestions.push("question1");
        examQuestions.push("question2");
        examQuestions.push("question3");
        vm.deal(user, USER_INITIAL_BALANCE);
    }

    function testCreateExams() public {
        assertEq(certifier.getLastExamId(), 0);
        certifier.createExam(
            "Test Name", "Test Description", block.timestamp + TIME_DURATION, examQuestions, EXAM_PRICE, 50
        );
        assertEq(certifier.getLastExamId(), 1);
        certifier.createExam(
            "Test Name", "Test Description", block.timestamp + TIME_DURATION, examQuestions, EXAM_PRICE, 50
        );
        assertEq(certifier.getLastExamId(), 2);
    }

    function testCreateExamSubmitAnswersCorrectExamClaimNFT() public {
        vm.prank(certifierOrg);
        certifier.updatePfp("THEIMAGE");
        vm.prank(certifierOrg);
        certifier.createExam(
            "Test Name", "Test Description", block.timestamp + TIME_DURATION, examQuestions, EXAM_PRICE, 2
        );
        uint256 examId = 0;
        uint256 userAnswersAsNumber = 111;
        uint256 secretNumber = 123;
        bytes32 hashedAnswer = keccak256(abi.encodePacked(userAnswersAsNumber, user, secretNumber));
        vm.prank(user);
        certifier.submitAnswers{value: EXAM_PRICE}(hashedAnswer, examId);
        vm.warp(block.timestamp + TIME_DURATION + 1);
        uint256[] memory answers = new uint256[](3);
        answers[0] = 1;
        answers[1] = 1;
        answers[2] = 1;
        vm.prank(certifierOrg);
        certifier.correctExam(examId, answers);
        vm.prank(user);
        certifier.claimNftCertificate(examId, answers, secretNumber);
        console.log(certifier.tokenURI(0));
        console.log("insert the about thing in the browser url");
    }
}
