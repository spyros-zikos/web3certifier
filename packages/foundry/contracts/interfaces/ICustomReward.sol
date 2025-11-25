// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICustomReward {
    /**
     * @return The name of the custom reward
     */
    function name() external pure returns (string memory);

    /**
     * @return The description of the custom reward
     */
    function description() external pure returns (string memory);

    /**
     * @notice required if the distribution type or eligibility type is custom
     * Returns whether the user is eligible for a custom reward
     * @param user The address of the user
     */
    function isEligible(address user) external view returns (bool);

    /**
     * @notice required if the distribution type is custom
     * This function returns the amount of tokens that this user should get
     * @param user The address of the user
     * @param distributionParameter The distribution parameter, has 18 decimals
     * @return The amount of tokens that this user should get
     */
    function rewardAmountForUser(address user, uint256 distributionParameter) external view returns (uint256);
}