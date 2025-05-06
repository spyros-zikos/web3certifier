// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.24;

// import { Reward } from "./Reward.sol";
// import { ICertifier } from "./interfaces/ICertifier.sol";

// contract RewardFactory {
//     error RewardFactory__RewardAlreadyExists(uint256 examId);

//     address private s_certifier; // certifier contract address
//     address[] private s_rewards;
//     mapping(uint256 examId => address reward) private s_examIdToReward;

//     constructor(address certifier) {
//         s_certifier = certifier;
//     }

//     function createReward(
//         uint256 examId,
//         uint256 initialRewardAmount,
//         uint256 rewardAmountPerPerson,
//         uint256 rewardAmountPerCorrectAnswer,
//         address tokenAddress
//     ) external returns (address) {
//         if (s_examIdToReward[examId] != address(0)) revert RewardFactory__RewardAlreadyExists(examId);
//         if (msg.sender != ICertifier(s_certifier).getExam(examId).certifier) revert();
    
//         address reward = address(new Reward(msg.sender, examId, initialRewardAmount, rewardAmountPerPerson, rewardAmountPerCorrectAnswer, tokenAddress, msg.sender));

//         s_rewards.push(reward);
//         s_examIdToReward[examId] = reward;
//         return reward;
//     }

//     function getCertifier() external view returns (address) {
//         return s_certifier;
//     }

//     function getRewards() external view returns (address[] memory) {
//         return s_rewards;
//     }

//     function getReward(uint256 index) external view returns (address) {
//         return s_rewards[index];
//     }

//     function getRewardByExamId(uint256 examId) external view returns (address) {
//         return s_examIdToReward[examId];
//     }
// }