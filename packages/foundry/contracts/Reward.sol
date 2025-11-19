// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { ICertifier } from "./interfaces/ICertifier.sol";
import { ICustomReward } from "./interfaces/ICustomReward.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { RewardFactory } from "./RewardFactory.sol";

contract Reward is Ownable, ReentrancyGuard {
    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event Reward__NewReward(address certifier, uint256 examId, uint256 distributionParameter, address rewardToken, address factory);
    event Reward__Fund(uint256 amount);
    event Reward__Claim(address user, uint256 amount);
    event Reward__Withdraw(uint256 amount);
    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/
    error Reward__UserAlreadyClaimed(address user);
    error Reward__UserDidNotSucceed(address user);
    error Reward__UserDoesNotSatisfyEligibilityCriteria(address user);
    error Reward__NotEnoughRewardTokens(uint256 rewardAmount, uint256 contractBalance);
    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    mapping(address => bool) private s_userHasClaimed;
    address[] private s_usersThatClaimed;
    address private immutable i_certifierContractAddress;
    uint256 private immutable i_examId;
    address private immutable i_rewardToken;
    address private immutable i_factory;
    RewardFactory.DistributionType private immutable i_distributionType;
    uint256 private s_distributionParameter;
    RewardFactory.EligibilityCriteria private immutable i_eligibilityCriteria;
    address private immutable i_eligibilityParameter;
    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    /**
     * @notice needs approval for the token
     * 
     * @param certifier Address of the certifier contract
     * @param examId Id of the exam
     * @param rewardToken Token address
     * @param owner Address of the owner
     * @param distributionType Distribution type
     * @param distributionParameter Distribution parameter - has 18 decimals
     * @param eligibilityCriteria Eligibility criteria
     * @param eligibilityParameter Eligibility parameter
     */
    constructor(
        address certifier,
        uint256 examId,
        address rewardToken,
        address owner,
        RewardFactory.DistributionType distributionType,
        uint256 distributionParameter,
        RewardFactory.EligibilityCriteria eligibilityCriteria,
        address eligibilityParameter
    ) Ownable(owner) {
        i_certifierContractAddress = certifier;
        i_examId = examId;
        i_rewardToken = rewardToken;
        i_factory = msg.sender;
        i_distributionType = distributionType;
        s_distributionParameter = distributionParameter;
        i_eligibilityCriteria = eligibilityCriteria;
        i_eligibilityParameter = eligibilityParameter;
        emit Reward__NewReward(certifier, examId, distributionParameter, rewardToken, i_factory);
    }
    /*//////////////////////////////////////////////////////////////
                          EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    /**
     * @notice needs approval for the token
     */ 
    function fund(uint256 amount) external {
        IERC20(i_rewardToken).transferFrom(msg.sender, address(this), amount);
        emit Reward__Fund(amount);
    }

    function claim() external nonReentrant {
        // check if user has already claimed the reward
        if (s_userHasClaimed[msg.sender]) revert Reward__UserAlreadyClaimed(msg.sender);
        // check if the user has claimed the NFT certificate, if not he is not allowed to claim the reward
        if (!userHasSucceeded(msg.sender)) revert Reward__UserDidNotSucceed(msg.sender);
        // check if the user satisfies the eligibility criteria
        if (!satisfiesEligibilityCriteria(msg.sender)) revert Reward__UserDoesNotSatisfyEligibilityCriteria(msg.sender);

        s_userHasClaimed[msg.sender] = true;
        s_usersThatClaimed.push(msg.sender);

        uint256 rewardAmount = rewardAmountForUser(msg.sender);
        // check if the contract has enough reward tokens
        if (rewardTokenBalance() < rewardAmount) revert Reward__NotEnoughRewardTokens(rewardAmount, rewardTokenBalance());
        IERC20(i_rewardToken).approve(msg.sender, rewardAmount);
        IERC20(i_rewardToken).transfer(msg.sender, rewardAmount);
        emit Reward__Claim(msg.sender, rewardAmount);
    }

    function withdraw() external onlyOwner {
        uint256 contractBalance = rewardTokenBalance();
        if (contractBalance == 0) return;
        IERC20(i_rewardToken).approve(owner(), contractBalance);
        IERC20(i_rewardToken).transfer(owner(), contractBalance);
        emit Reward__Withdraw(contractBalance);
    }

    // Public Functions

    function satisfiesEligibilityCriteria(address user) public view returns (bool) {
        if (i_eligibilityCriteria == RewardFactory.EligibilityCriteria.NONE) {
            return true;
        } else if (i_eligibilityCriteria == RewardFactory.EligibilityCriteria.CUSTOM) {
            return ICustomReward(i_eligibilityParameter).isEligible(user);
        } else if (i_eligibilityCriteria == RewardFactory.EligibilityCriteria.HOLDS_TOKEN) {
            return IERC20(i_eligibilityParameter).balanceOf(user) > 0;
        } else if (i_eligibilityCriteria == RewardFactory.EligibilityCriteria.HOLDS_NFT) {
            return IERC721(i_eligibilityParameter).balanceOf(user) > 0;
        }
        return false;
    }

    function rewardAmountForUser(address user) public view returns (uint256) {
        if (i_distributionType == RewardFactory.DistributionType.CUSTOM) {
            return ICustomReward(i_eligibilityParameter).rewardAmount(user, s_distributionParameter);
        } else if (i_distributionType == RewardFactory.DistributionType.CONSTANT) {
            return s_distributionParameter;
        } else if (i_distributionType == RewardFactory.DistributionType.UNIFORM) {
            uint256 numberOfSubmissions = ICertifier(i_certifierContractAddress).getExam(i_examId).numberOfSubmissions;
            return s_distributionParameter / numberOfSubmissions;
        }
        return 0;
    }

    function userHasSucceeded(address user) public view returns (bool) {
        return ICertifier(i_certifierContractAddress).getUserStatus(user, i_examId) == ICertifier.UserStatus.Succeeded;
    }

    function rewardTokenBalance() public view returns (uint256) {
        return IERC20(i_rewardToken).balanceOf(address(this));
    }

    // Getter functions

    function getUserHasClaimed(address user) external view returns (bool) {
        return s_userHasClaimed[user];
    }

    function getUsersThatClaimed() external view returns (address[] memory) {
        return s_usersThatClaimed;
    }
    
    function getCertifierContractAddress() external view returns (address) {
        return i_certifierContractAddress;
    }

    function getExamId() external view returns (uint256) {
        return i_examId;
    }

    function getRewardToken() external view returns (address) {
        return i_rewardToken;
    }

    function getFactory() external view returns (address) {
        return i_factory;
    }


    function getDistributionType() external view returns (RewardFactory.DistributionType) {
        return i_distributionType;
    }

    function getDistributionParameter() external view returns (uint256) {
        return s_distributionParameter;
    }

    function getEligibilityCriteria() external view returns (RewardFactory.EligibilityCriteria) {
        return i_eligibilityCriteria;
    }

    function getEligibilityParameter() external view returns (address) {
        return i_eligibilityParameter;
    }
    
    // Setter functions

    function setDistributionParameter(uint256 distributionParameter) external onlyOwner {
        s_distributionParameter = distributionParameter;
    }
}