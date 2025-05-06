// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.24;

// import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import { ICertifier } from "./interfaces/ICertifier.sol";
// import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

// contract Reward is Ownable {
//     /*//////////////////////////////////////////////////////////////
//                                 EVENTS
//     //////////////////////////////////////////////////////////////*/
//     event Reward__NewReward(address certifier, uint256 examId, uint256 initialRewardAmount, uint256 rewardAmountPerPerson, address tokenAddress, address factory);
//     event Reward__Fund(uint256 amount);
//     event Reward__Claim(address user, uint256 amount);
//     event Reward__Withdraw(uint256 amount);
//     /*//////////////////////////////////////////////////////////////
//                                 ERRORS
//     //////////////////////////////////////////////////////////////*/
//     error Reward__UserAlreadyClaimed(address user);
//     /*//////////////////////////////////////////////////////////////
//                             STATE VARIABLES
//     //////////////////////////////////////////////////////////////*/
//     uint256 private s_rewardAmountPerPerson;
//     uint256 private s_rewardAmountPerCorrectAnswer;
//     mapping(address => bool) private s_userHasClaimed;
//     address[] private s_usersThatClaimed;

//     address private immutable i_certifier;
//     uint256 private immutable i_examId;
//     address private immutable i_tokenAddress;
//     address private immutable i_factory;
//     /*//////////////////////////////////////////////////////////////
//                               CONSTRUCTOR
//     //////////////////////////////////////////////////////////////*/
//     /**
//      * @notice needs approval for the token
//      * 
//      * @param certifier Address of the certifier contract
//      * @param examId Id of the exam
//      * @param initialRewardAmount Initial reward amount
//      * @param rewardAmountPerPerson Reward amount per person
//      * @param tokenAddress Token address
//      * @param owner Address of the owner
//      */
//     constructor(
//         address certifier,
//         uint256 examId,
//         uint256 initialRewardAmount,
//         uint256 rewardAmountPerPerson,
//         uint256 rewardAmountPerCorrectAnswer,
//         address tokenAddress,
//         address owner
//     ) Ownable(owner) {
//         i_certifier = certifier;
//         i_examId = examId;
//         s_rewardAmountPerPerson = rewardAmountPerPerson;
//         s_rewardAmountPerCorrectAnswer = rewardAmountPerCorrectAnswer;
//         i_tokenAddress = tokenAddress;
//         i_factory = msg.sender;
//         IERC20(tokenAddress).transferFrom(owner, address(this), initialRewardAmount);
//         emit Reward__NewReward(certifier, examId, initialRewardAmount, rewardAmountPerPerson, tokenAddress, i_factory);
//     }
//     /*//////////////////////////////////////////////////////////////
//                           EXTERNAL FUNCTIONS
//     //////////////////////////////////////////////////////////////*/
//     /**
//      * @notice needs approval for the token
//      */ 
//     function fund(uint256 amount) external {
//         IERC20(i_tokenAddress).transferFrom(msg.sender, address(this), amount);
//         emit Reward__Fund(amount);
//     }

//     function claim() external returns (bool) {
//         // check if user has already claimed the reward
//         if (s_userHasClaimed[msg.sender]) revert Reward__UserAlreadyClaimed(msg.sender);
//         // check if the user has claimed the NFT certificate, if not he is not allowed to claim the reward
//         if (!ICertifier(i_certifier).getUserHasClaimed(msg.sender, i_examId)) return false;

//         s_userHasClaimed[msg.sender] = true;
//         s_usersThatClaimed.push(msg.sender);

//         uint256 rewardAmount = s_rewardAmountPerPerson;
//         if (s_rewardAmountPerCorrectAnswer != 0) {
//             int256 numberOfCorrectAnswers = 0;//ICertifier(i_certifier).getScore(i_examId, msg.sender);
//             if (numberOfCorrectAnswers > 0)
//                 rewardAmount += s_rewardAmountPerCorrectAnswer * uint256(numberOfCorrectAnswers);
//         }
//         IERC20(i_tokenAddress).approve(msg.sender, rewardAmount);
//         IERC20(i_tokenAddress).transfer(msg.sender, rewardAmount);
//         emit Reward__Claim(msg.sender, rewardAmount);
//         return true;
//     }

//     function withdraw() external onlyOwner {
//         if (IERC20(i_tokenAddress).balanceOf(address(this)) == 0) return;
//         IERC20(i_tokenAddress).approve(owner(), IERC20(i_tokenAddress).balanceOf(address(this)));
//         IERC20(i_tokenAddress).transfer(owner(), IERC20(i_tokenAddress).balanceOf(address(this)));
//         emit Reward__Withdraw(IERC20(i_tokenAddress).balanceOf(address(this)));
//     }

//     // Getter functions

//     function getRewardAmountPerPerson() external view returns (uint256) {
//         return s_rewardAmountPerPerson;
//     }

//     function getRewardAmountPerCorrectAnswer() external view returns (uint256) {
//         return s_rewardAmountPerCorrectAnswer;
//     }

//     function getUserHasClaimed(address user) external view returns (bool) {
//         return s_userHasClaimed[user];
//     }

//     function getUsersThatClaimed() external view returns (address[] memory) {
//         return s_usersThatClaimed;
//     }

//     function getCertifier() external view returns (address) {
//         return i_certifier;
//     }

//     function getExamId() external view returns (uint256) {
//         return i_examId;
//     }

//     function getTokenAddress() external view returns (address) {
//         return i_tokenAddress;
//     }

//     function getFactory() external view returns (address) {
//         return i_factory;
//     }

//     // Setter functions

//     function setRewardAmountPerPerson(uint256 rewardAmountPerPerson) external onlyOwner {
//         s_rewardAmountPerPerson = rewardAmountPerPerson;
//     }

//     function setRewardAmountPerCorrectAnswer(uint256 rewardAmountPerCorrectAnswer) external onlyOwner {
//         s_rewardAmountPerCorrectAnswer = rewardAmountPerCorrectAnswer;
//     }
// }