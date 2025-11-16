// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICustomReward {
    /**
     * Returns whether the user is eligible for a custom reward
     * @param user The address of the user
     */
    function isEligible(address user) external view returns (bool);

    /**
     * This function returns the amount of tokens that this user should get
     * @param user The address of the user
     * @param distributionParameter The distribution parameter
     * @return The amount of tokens that this user should get
     */
    function getRewardAmount(address user, uint256 distributionParameter) external view returns (uint256);
}