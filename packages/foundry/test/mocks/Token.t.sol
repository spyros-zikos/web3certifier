// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(address user, uint256 initialSupply) ERC20("Token", "TOK") {
        _mint(user, initialSupply);
    }
}