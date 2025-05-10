// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import "../src/Escrow.sol";

contract DeployAndInteract is Script {
    Escrow public escrow;

    address buyer = address(uint160(vm.envUint("PRIVATE_KEY_B")));
    address seller = address(uint160(vm.envUint("PRIVATE_KEY_S")));

    function run() external {
        vm.startBroadcast();
        escrow = new Escrow();
        vm.stopBroadcast();

        vm.startBroadcast(vm.envUint("PRIVATE_KEY_B"));
        uint id = escrow.createEscrow{value: 0.001 ether}(seller);
        escrow.approve(id);
        vm.stopBroadcast();

        vm.startBroadcast(vm.envUint("PRIVATE_KEY_S"));
        escrow.approve(id);
        vm.stopBroadcast();
    }
}
