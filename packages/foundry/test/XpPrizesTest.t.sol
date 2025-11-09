// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {XpPrizes} from "../contracts/XpPrizes.sol";
import {MockCertifier} from "./mocks/MockCertifier.sol";
import {ICertifier} from "../contracts/interfaces/ICertifier.sol";
import {MockToken} from "./mocks/MockToken.sol";

contract XpPrizesTest is Test {
    uint256 public constant INITIAL_TOKEN_SUPPLY = 1000 ether;
    uint256 public constant EXPIRATION_TIME = 10000;
    uint256 public constant XP_POINT = 10;

    XpPrizes public xpPrizes;
    MockCertifier public mockCertifier;
    MockToken public mockToken;
    address user = makeAddr("user");

    function setUp() public {
        mockToken = new MockToken(address(this), INITIAL_TOKEN_SUPPLY);  // mint initial supply (useless)
        mockCertifier = new MockCertifier();
        xpPrizes = new XpPrizes(address(mockToken), address(mockCertifier), block.timestamp + EXPIRATION_TIME);
        mockToken.mint(address(xpPrizes), xpPrizes.getXpPrize(XP_POINT).prizeAmount);
        mockCertifier.setUserXp(user, XP_POINT);
    }

    function testClaimSuccessful() public {
        vm.prank(user);
        xpPrizes.claim(XP_POINT);
        assert(mockToken.balanceOf(user) == 1000);
    }

    function testClaimTimeExpired() public {
        uint256 initialTimeStamp = block.timestamp;
        vm.warp(block.timestamp + EXPIRATION_TIME + 1);
        vm.expectRevert(abi.encodeWithSelector(XpPrizes.XpPrizes__Expired.selector, block.timestamp, initialTimeStamp + EXPIRATION_TIME));
        vm.prank(user);
        xpPrizes.claim(XP_POINT);
        assert(mockToken.balanceOf(user) == 0);
    }

    function testClaimAlreadyClaimed() public {
        vm.prank(user);
        xpPrizes.claim(XP_POINT);
        vm.expectRevert(abi.encodeWithSelector(XpPrizes.XpPrizes__AlreadyClaimed.selector, user, XP_POINT));
        vm.prank(user);
        xpPrizes.claim(XP_POINT);
        assert(mockToken.balanceOf(user) == 1000);
    }

    function testClaimNotEnoughXp() public {
        uint256 userXp = XP_POINT - 1;
        mockCertifier.setUserXp(user, userXp);

        vm.expectRevert(abi.encodeWithSelector(XpPrizes.XpPrizes__NotEnoughXp.selector, user, XP_POINT, userXp));
        vm.prank(user);
        xpPrizes.claim(XP_POINT);
        assert(mockToken.balanceOf(user) == 0);
    }

    function testClaimNotValidXpPoint() public {
        uint256 invalidXpPoint = XP_POINT - 1;

        vm.expectRevert(abi.encodeWithSelector(XpPrizes.XpPrizes__NotValidXpPoint.selector, invalidXpPoint));
        vm.prank(user);
        xpPrizes.claim(invalidXpPoint);
        assert(mockToken.balanceOf(user) == 0);
    }

    function testClaimPrizeNotAvailable() public {
        mockToken.mint(address(xpPrizes), 1000000);

        uint256 users = 10;  // = availablePrizes
        for (uint256 i = 1; i <= users; i++) {
            address userAddress = address(uint160(i)); 
            mockCertifier.setUserXp(userAddress, XP_POINT);
            vm.prank(userAddress);
            xpPrizes.claim(XP_POINT);
        }
        
        vm.expectRevert(abi.encodeWithSelector(XpPrizes.XpPrizes__PrizeNotAvailable.selector, XP_POINT));
        vm.prank(user);
        xpPrizes.claim(XP_POINT);
        assert(mockToken.balanceOf(user) == 0);
    }
}