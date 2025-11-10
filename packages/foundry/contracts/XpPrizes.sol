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
        string name;
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
                name: "", description: string.concat("Reach ", s_xpPoints[i].toString(), " xp"), prizeAmount: s_xpPoints[i] * 100, availablePrizes: 10
            });
        }
        s_xpPrizes[0].name = "Getting Started";
        s_xpPrizes[1].name = "First Steps";
        s_xpPrizes[2].name = "Making Progress";
        s_xpPrizes[3].name = "Going Strong";
        s_xpPrizes[4].name = "Master Level";
    }
    
    // External Functions
    function claim(uint256 xpPoint) external nonReentrant {
        if (timeExpired()) revert XpPrizes__Expired(block.timestamp, s_expirationTimestamp);
        if (s_xpPrizeClaims[msg.sender][xpPoint]) revert XpPrizes__AlreadyClaimed(msg.sender, xpPoint);
        if (userXp(msg.sender) < xpPoint)revert XpPrizes__NotEnoughXp(msg.sender, xpPoint, ICertifier(s_certifier).getUserXp(msg.sender));
        if (!isValidXpPoint(xpPoint)) revert XpPrizes__NotValidXpPoint(xpPoint);
        if (s_xpPrizes[xpPoint].availablePrizes == 0) revert XpPrizes__PrizeNotAvailable(xpPoint);
        if (tokenBalance() < s_xpPrizes[xpPoint].prizeAmount) revert XpPrizes__NotEnoughPrizeTokens(xpPoint);

        s_xpPrizes[xpPoint].availablePrizes--;
        s_xpPrizeClaims[msg.sender][xpPoint] = true;

        IERC20(s_prizeToken).transfer(msg.sender, s_xpPrizes[xpPoint].prizeAmount);

        emit XpPrizeClaimed(msg.sender, xpPoint);
    }

    function fund() external {
        uint256 totalPrizeAmount;
        for (uint256 i = 0; i < s_xpPoints.length; i++) {
            totalPrizeAmount += s_xpPrizes[s_xpPoints[i]].prizeAmount * s_xpPrizes[s_xpPoints[i]].availablePrizes;
        }
        IERC20(s_prizeToken).transferFrom(msg.sender, address(this), totalPrizeAmount);
        emit Fund(msg.sender, totalPrizeAmount);
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