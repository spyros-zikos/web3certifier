//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {XpPrizes} from "../../contracts/XpPrizes.sol";
import {Script, console} from "forge-std/Script.sol";
import {MockToken} from "../../test/mocks/MockToken.sol";

contract DeployXpPrizes is Script {
    address prizeToken = block.chainid == 11155111 ? 0x32D7E390bE97b4a42d6fB77f0f2DC3D158076295  // Sepolia test token
        : 0x3fb563125C655D5d37026980313518Ed545FE3a1;  // GoodDollar: 0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A / test token: 0x3fb563125C655D5d37026980313518Ed545FE3a1
    address certifierProxy = block.chainid == 11155111 ? vm.envAddress("SEPOLIA_CERTIFIER_PROXY_ADDRESS")
        : vm.envAddress("CELO_CERTIFIER_PROXY_ADDRESS");
    uint256 expirationTimestamp = block.timestamp + 2*24*60*60;  // 2 days
    
    /// @notice Needs a certifier proxy DEPLOYED
    function run() external returns (address) {
        vm.startBroadcast(vm.envAddress("DEPLOYER_ADDRESS"));
        address xpPrizes = address(new XpPrizes(
            prizeToken, // address prizeToken,
            certifierProxy, // address certifier,
            expirationTimestamp // uint256 expirationTimestamp
        ));
        if (prizeToken == 0x3fb563125C655D5d37026980313518Ed545FE3a1) MockToken(prizeToken).mint(xpPrizes, 1000000e18);
        vm.stopBroadcast();
        console.log("XpPrizes Contract deployed at: ", xpPrizes);
        return (xpPrizes);
    }
}
