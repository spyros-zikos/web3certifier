// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { Reward } from "./Reward.sol";
import { ICertifier } from "./interfaces/ICertifier.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract RewardFactory is Initializable, UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuard {
    event CreateReward(uint256 examId, address reward, uint256 initialRewardAmount, uint256 rewardAmountPerPerson, uint256 rewardAmountPerCorrectAnswer, address tokenAddress);
    event RemoveReward(uint256 examId);

    error RewardFactory__RewardAlreadyExists(uint256 examId);
    error RewardFactory__UserIsNotCertifier(address user, address certifier);

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
     * @notice needs approval
     */ 
    function createReward(
        uint256 examId,
        uint256 initialRewardAmount,
        uint256 rewardAmountPerPerson,
        uint256 rewardAmountPerCorrectAnswer,
        address tokenAddress
    ) external returns (address) {
        if (s_examIdToReward[examId] != address(0)) revert RewardFactory__RewardAlreadyExists(examId);
        address examCertifier = ICertifier(i_certifierContractAddress).getExam(examId).certifier;
        if (msg.sender != examCertifier)
            revert RewardFactory__UserIsNotCertifier(msg.sender, examCertifier);
    
        address reward = address(new Reward(
            i_certifierContractAddress,
            examId,
            initialRewardAmount,
            rewardAmountPerPerson,
            rewardAmountPerCorrectAnswer,
            tokenAddress,
            msg.sender
        ));
        IERC20(tokenAddress).transferFrom(msg.sender, reward, initialRewardAmount);
        s_rewards.push(reward);
        s_examIdToReward[examId] = reward;
        emit CreateReward(examId, reward, initialRewardAmount, rewardAmountPerPerson, rewardAmountPerCorrectAnswer, tokenAddress);
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