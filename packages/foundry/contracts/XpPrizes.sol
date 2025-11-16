// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import { ICertifier } from "./interfaces/ICertifier.sol";


/**
 * @title Users can claim prizes based on their xp
 * @notice Only deploy it when the xp of the Certifier has been reset
 */
contract XpPrizes is Ownable, ReentrancyGuard {
    using Strings for uint256;
    // Structs
    struct XpPrize {
        string title;
        string description;
        uint256 prizeAmount;
        uint256 availablePrizes;
    }

    // State Variables
    address private s_prizeToken;
    address private s_certifier;
    uint256 private s_expirationTimestamp;
    uint256[] private s_xpPoints = [10, 25, 50, 75, 100];
    mapping(uint256 => XpPrize) private s_xpPrizes;
    mapping(address user => mapping(uint256 xpPoint => bool hasClaimed)) private s_xpPrizeClaims;

    // Events
    event XpPrizeClaimed(address user, uint256 xpPoint);
    event Fund(address funder, uint256 amount);

    // Errors
    error XpPrizes__Expired(uint256 currentTimestamp, uint256 expirationTimestamp);
    error XpPrizes__AlreadyClaimed(address user, uint256 xpPoint);
    error XpPrizes__NotEnoughXp(address user, uint256 xpPoint, uint256 userXp);
    error XpPrizes__NotValidXpPoint(uint256 xpPoint);
    error XpPrizes__PrizeNotAvailable(uint256 xpPoint);
    error XpPrizes__NotEnoughPrizeTokens(uint256 xpPoint);

    // Constructor
    constructor(address prizeToken, address certifier, uint256 expirationTimestamp) Ownable(msg.sender) {
        s_prizeToken = prizeToken;
        s_certifier = certifier;
        s_expirationTimestamp = expirationTimestamp;

        for (uint256 i = 0; i < s_xpPoints.length; i++) {
            s_xpPrizes[s_xpPoints[i]] = XpPrize({
                title: "", description: string.concat("Reach ", s_xpPoints[i].toString(), " xp"), prizeAmount: s_xpPoints[i] * 100e18, availablePrizes: 10
            });
        }
        s_xpPrizes[s_xpPoints[0]].title = "Getting Started";
        s_xpPrizes[s_xpPoints[1]].title = "First Steps";
        s_xpPrizes[s_xpPoints[2]].title = "Making Progress";
        s_xpPrizes[s_xpPoints[3]].title = "Going Strong";
        s_xpPrizes[s_xpPoints[4]].title = "Master Level";
        s_xpPrizes[s_xpPoints[0]].availablePrizes = 10;
        s_xpPrizes[s_xpPoints[1]].availablePrizes = 5;
        s_xpPrizes[s_xpPoints[2]].availablePrizes = 3;
        s_xpPrizes[s_xpPoints[3]].availablePrizes = 2;
        s_xpPrizes[s_xpPoints[4]].availablePrizes = 1;
    }
    
    // External Functions
    function claim(uint256 xpPoint) external nonReentrant {
        if (timeExpired()) revert XpPrizes__Expired(block.timestamp, s_expirationTimestamp);
        if (s_xpPrizeClaims[msg.sender][xpPoint]) revert XpPrizes__AlreadyClaimed(msg.sender, xpPoint);
        if (userXp(msg.sender) < xpPoint)revert XpPrizes__NotEnoughXp(msg.sender, xpPoint, userXp(msg.sender));
        if (!isValidXpPoint(xpPoint)) revert XpPrizes__NotValidXpPoint(xpPoint);
        if (s_xpPrizes[xpPoint].availablePrizes == 0) revert XpPrizes__PrizeNotAvailable(xpPoint);
        if (tokenBalance() < s_xpPrizes[xpPoint].prizeAmount) revert XpPrizes__NotEnoughPrizeTokens(xpPoint);

        s_xpPrizes[xpPoint].availablePrizes--;
        s_xpPrizeClaims[msg.sender][xpPoint] = true;

        IERC20(s_prizeToken).transfer(msg.sender, s_xpPrizes[xpPoint].prizeAmount);

        emit XpPrizeClaimed(msg.sender, xpPoint);
    }

    // Needs approval
    function fund() external {
        if (timeExpired()) revert XpPrizes__Expired(block.timestamp, s_expirationTimestamp);
        if (IERC20(s_prizeToken).balanceOf(address(this)) >= totalPrizeAmount()) return;
        uint256 amount = totalPrizeAmount();
        IERC20(s_prizeToken).transferFrom(msg.sender, address(this), amount);
        emit Fund(msg.sender, amount);
    }

    function withdraw() external onlyOwner {
        if (IERC20(s_prizeToken).balanceOf(address(this)) == 0) return;
        IERC20(s_prizeToken).transfer(owner(), IERC20(s_prizeToken).balanceOf(address(this)));
    }

    receive() external payable {
        if (timeExpired()) revert XpPrizes__Expired(block.timestamp, s_expirationTimestamp);
    }

    // Public Functions
    function isValidXpPoint(uint256 xpPoint) public view returns (bool) {
        for (uint256 i = 0; i < s_xpPoints.length; i++) if (s_xpPoints[i] == xpPoint) return true;
        return false;
    }

    function timeExpired() public view returns (bool) {
        return block.timestamp > s_expirationTimestamp;
    }

    function userXp(address user) public view returns (uint256) {
        return ICertifier(s_certifier).getUserXp(user);
    }

    function tokenBalance() public view returns (uint256) {
        return IERC20(s_prizeToken).balanceOf(address(this));
    }

    function totalPrizeAmount() public view returns (uint256) {
        uint256 amount;
        for (uint256 i = 0; i < s_xpPoints.length; i++) {
            amount += s_xpPrizes[s_xpPoints[i]].prizeAmount * s_xpPrizes[s_xpPoints[i]].availablePrizes;
        }
        return amount;
    }

    // Getter Functions
    function getPrizeToken() public view returns (address) {
        return s_prizeToken;
    }

    function getCertifier() public view returns (address) {
        return s_certifier;
    }

    function getExpirationTimestamp() public view returns (uint256) {
        return s_expirationTimestamp;
    }

    function getXpPoints() public view returns (uint256[] memory) {
        return s_xpPoints;
    }

    function getXpPrize(uint256 xpPoint) public view returns (XpPrize memory) {
        return s_xpPrizes[xpPoint];
    }

    function getUserHasClaimed(address user, uint256 xpPoint) public view returns (bool) {
        return s_xpPrizeClaims[user][xpPoint];
    }

    // Setter Functions
    function setPrizeToken(address newPrizeToken) external onlyOwner {
        s_prizeToken = newPrizeToken;
    }

    function setCertifier(address newCertifier) external onlyOwner {
        s_certifier = newCertifier;
    }

    function setExpirationTimestamp(uint256 newExpirationTimestamp) external onlyOwner {
        s_expirationTimestamp = newExpirationTimestamp;
    }
}