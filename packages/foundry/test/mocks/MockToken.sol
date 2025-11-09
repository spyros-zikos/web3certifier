// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor(address user, uint256 initialSupply) ERC20("Token", "TOK") {
        _mint(user, initialSupply);
    }

    function mint(address user, uint256 amount) public {
        _mint(user, amount);
    }
}