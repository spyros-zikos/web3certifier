// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

enum Status {
  Success,
  Fail
}

struct Exam {
  uint256 id;
  string name;
  string description;
  uint256 score;
  uint256 timeStart;
  Status status;
}

contract Certifier {
  mapping(address => Exam[]) public exams;

  function makeExam() external payable { }

  function submitAnswers() external payable { }

  function updatePfp() external { }
}
