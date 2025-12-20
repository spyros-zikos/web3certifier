// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { Reward } from "./Reward.sol";
import { ICertifier } from "./interfaces/ICertifier.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract RewardFactory is Initializable, UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuard {
    /*//////////////////////////////////////////////////////////////
                                 ENUMS
    //////////////////////////////////////////////////////////////*/
    /**
     * @notice DRAW distribution is using the distributionParameter as a random number to pick the winner
     * if it's 0 then it's not drawn. Users that pass the exam have to call the claim function of the Reward contract first
     * so that they are included in the draw. Because they call the claim function all users appear as if they have claimed.
     * When a winner is drawn, their address in the s_userHasClaimed array is set to false so they can call the claim function again
     * and this time actually claim the reward.
     * 
     */
    enum DistributionType {CUSTOM, CONSTANT, UNIFORM, DRAW}
    enum EligibilityType {NONE, CUSTOM, HOLDS_TOKEN, HOLDS_NFT}
    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event CreateReward(uint256 examId, address reward, uint256 distributionParameter, address rewardToken);
    event RemoveReward(uint256 examId);
    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/
    error RewardFactory__RewardAlreadyExists(uint256 examId);
    error RewardFactory__UserIsNotCertifier(address user, address certifier);
    error RewardFactory__CustomDistributionTypeNeedsCustomEligibilityType();
    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    address private i_certifierContractAddress; // certifier contract address
    address[] private s_rewards;
    mapping(uint256 examId => address reward) private s_examIdToReward;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address certifierContractAddress) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        i_certifierContractAddress = certifierContractAddress;
    }

    /**
     * @notice if you set custom distribution type, you need to also set custom eligibility type
     * 
     * @param distributionParameter:
     *  for constant distribution: reward amount,
     *  for uniform distribution: total reward amount,
     *  for custom distribution: custom parameter
     *  for draw distribution: 0 if not drawn, a random number if drawn
     */ 
    function createReward(
        uint256 examId,
        address rewardToken,
        DistributionType distributionType,
        uint256 distributionParameter,  // has 18 decimals
        EligibilityType eligibilityType,
        address eligibilityParameter
    ) external returns (address) {
        if (s_examIdToReward[examId] != address(0)) revert RewardFactory__RewardAlreadyExists(examId);
        address examCertifier = ICertifier(i_certifierContractAddress).getExam(examId).certifier;
        if (msg.sender != examCertifier)
            revert RewardFactory__UserIsNotCertifier(msg.sender, examCertifier);
        if ((distributionType == DistributionType.CUSTOM) && (eligibilityType != EligibilityType.CUSTOM))
            revert RewardFactory__CustomDistributionTypeNeedsCustomEligibilityType();
    
        address reward = address(new Reward(
            i_certifierContractAddress,
            examId,
            rewardToken,
            msg.sender,
            distributionType,
            distributionParameter,
            eligibilityType,
            eligibilityParameter
        ));
        s_rewards.push(reward);
        s_examIdToReward[examId] = reward;
        emit CreateReward(examId, reward, distributionParameter, rewardToken);
        return reward;
    }

    function removeReward(uint256 examId) external {
        address examCertifier = ICertifier(i_certifierContractAddress).getExam(examId).certifier;
        if (msg.sender != examCertifier) revert RewardFactory__UserIsNotCertifier(msg.sender, examCertifier);
        s_examIdToReward[examId] = address(0);
        emit RemoveReward(examId);
    }

    function getCertifierContractAddress() external view returns (address) {
        return i_certifierContractAddress;
    }

    function getRewards() external view returns (address[] memory) {
        return s_rewards;
    }

    function getReward(uint256 index) external view returns (address) {
        return s_rewards[index];
    }

    function getRewardByExamId(uint256 examId) external view returns (address) {
        return s_examIdToReward[examId];
    }

    /*//////////////////////////////////////////////////////////////
                          INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}