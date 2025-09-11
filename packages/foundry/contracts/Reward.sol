// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ICertifier } from "./interfaces/ICertifier.sol";
import { ICustomReward } from "./interfaces/ICustomReward.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Reward is Ownable {
    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event Reward__NewReward(address certifier, uint256 examId, uint256 initialRewardAmount, uint256 rewardAmountPerPerson, address tokenAddress, address factory);
    event Reward__Fund(uint256 amount);
    event Reward__Claim(address user, uint256 amount);
    event Reward__Withdraw(uint256 amount);
    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/
    error Reward__UserAlreadyClaimed(address user);
    error Reward__UserDidNotSucceed(address user);
    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    uint256 private s_rewardAmountPerPerson;
    uint256 private s_rewardAmountPerCorrectAnswer;
    mapping(address => bool) private s_userHasClaimed;
    address[] private s_usersThatClaimed;

    address private immutable i_certifierContractAddress;
    uint256 private immutable i_examId;
    address private immutable i_tokenAddress;
    address private immutable i_factory;
    address private immutable i_customReward;
    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    /**
     * @notice needs approval for the token
     * 
     * @param certifier Address of the certifier contract
     * @param examId Id of the exam
     * @param initialRewardAmount Initial reward amount
     * @param rewardAmountPerPerson Reward amount per person
     * @param tokenAddress Token address
     * @param owner Address of the owner
     * @param customReward Address of the custom reward contract
     */
    constructor(
        address certifier,
        uint256 examId,
        uint256 initialRewardAmount,
        uint256 rewardAmountPerPerson,
        uint256 rewardAmountPerCorrectAnswer,
        address tokenAddress,
        address owner,
        address customReward
    ) Ownable(owner) {
        i_certifierContractAddress = certifier;
        i_examId = examId;
        s_rewardAmountPerPerson = rewardAmountPerPerson;
        s_rewardAmountPerCorrectAnswer = rewardAmountPerCorrectAnswer;
        i_tokenAddress = tokenAddress;
        i_factory = msg.sender;
        i_customReward = customReward;
        emit Reward__NewReward(certifier, examId, initialRewardAmount, rewardAmountPerPerson, tokenAddress, i_factory);
    }
    /*//////////////////////////////////////////////////////////////
                          EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    /**
     * @notice needs approval for the token
     */ 
    function fund(uint256 amount) external {
        IERC20(i_tokenAddress).transferFrom(msg.sender, address(this), amount);
        emit Reward__Fund(amount);
    }

    function claim() external {
        // check if user has already claimed the reward
        if (s_userHasClaimed[msg.sender]) revert Reward__UserAlreadyClaimed(msg.sender);
        // check if the user has claimed the NFT certificate, if not he is not allowed to claim the reward
        if (!getUserHasSucceeded(msg.sender)) revert Reward__UserDidNotSucceed(msg.sender);

        s_userHasClaimed[msg.sender] = true;
        s_usersThatClaimed.push(msg.sender);

        uint256 rewardAmount = getRewardAmountForUser(msg.sender);
        IERC20(i_tokenAddress).approve(msg.sender, rewardAmount);
        IERC20(i_tokenAddress).transfer(msg.sender, rewardAmount);
        emit Reward__Claim(msg.sender, rewardAmount);
    }

    function withdraw() external onlyOwner {
        if (IERC20(i_tokenAddress).balanceOf(address(this)) == 0) return;
        IERC20(i_tokenAddress).approve(owner(), IERC20(i_tokenAddress).balanceOf(address(this)));
        IERC20(i_tokenAddress).transfer(owner(), IERC20(i_tokenAddress).balanceOf(address(this)));
        emit Reward__Withdraw(IERC20(i_tokenAddress).balanceOf(address(this)));
    }

    // Getter functions

    function getRewardAmountForUser(address user) public view returns (uint256) {
        // default reward amount
        uint256 rewardAmount = s_rewardAmountPerPerson;
        uint256 numberOfCorrectAnswers = ICertifier(i_certifierContractAddress).getUserScore(i_examId, user);
        if (s_rewardAmountPerCorrectAnswer != 0)
            rewardAmount += s_rewardAmountPerCorrectAnswer * numberOfCorrectAnswers;

        // custom reward amount
        if (i_customReward != address(0))
            return getCustomRewardAmount(user, numberOfCorrectAnswers);

        return rewardAmount;
    }

    function getUserHasSucceeded(address user) public view returns (bool) {
        return ICertifier(i_certifierContractAddress).getUserStatus(user, i_examId) == ICertifier.UserStatus.Succeeded;
    }

    function getRewardAmountPerPerson() external view returns (uint256) {
        return s_rewardAmountPerPerson;
    }

    function getRewardAmountPerCorrectAnswer() external view returns (uint256) {
        return s_rewardAmountPerCorrectAnswer;
    }

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

    function getTokenAddress() external view returns (address) {
        return i_tokenAddress;
    }

    function getFactory() external view returns (address) {
        return i_factory;
    }

    function getCustomReward() external view returns (address) {
        return i_customReward;
    }

    function getCustomRewardAmount(
        address user,
        uint256 numberOfCorrectAnswers
    ) public view returns (uint256) {
        return ICustomReward(i_customReward).getCustomRewardAmountForUser(
            user,
            numberOfCorrectAnswers,
            s_rewardAmountPerPerson,
            s_rewardAmountPerCorrectAnswer
        );
    }
    
    // Setter functions

    function setRewardAmountPerPerson(uint256 rewardAmountPerPerson) external onlyOwner {
        s_rewardAmountPerPerson = rewardAmountPerPerson;
    }

    function setRewardAmountPerCorrectAnswer(uint256 rewardAmountPerCorrectAnswer) external onlyOwner {
        s_rewardAmountPerCorrectAnswer = rewardAmountPerCorrectAnswer;
    }
}