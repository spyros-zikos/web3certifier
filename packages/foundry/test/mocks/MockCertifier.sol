// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract MockCertifier {
    mapping(address user => uint256 xp) private s_userXp;

    function getUserXp(address user) public view returns (uint256) {
        return s_userXp[user];
    }

    function setUserXp(address user, uint256 xp) public {
        s_userXp[user] = xp;
    }
}