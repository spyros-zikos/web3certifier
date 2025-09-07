// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICustomReward {
    /**
     * This function returns whether the user is eligible for the reward
     * @param user The address of the user
     * @return Whether the user is eligible for the reward
     */
    function isEligible(address user) external view returns (bool);

    /**
     * This function returns the amount of tokens that this user should get
     * If this returns 0, the default reward amount will be used
     * @param user The address of the user
     * @param numberOfCorrectAnswers The number of correct answers of the user
     * @param s_rewardAmountPerPerson The reward amount per person
     * @param s_rewardAmountPerCorrectAnswer The reward amount per correct answer
     * @return The amount of tokens that this user should get
     */
    function getCustomRewardAmountForUser(
        address user,
        uint256 numberOfCorrectAnswers,
        uint256 s_rewardAmountPerPerson,
        uint256 s_rewardAmountPerCorrectAnswer
    ) external view returns (uint256);
}