// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Transaction} from "../src/Transaction.sol";

contract TransactionScript is Script {
    Transaction public transaction;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        transaction = new Transaction();
        vm.stopBroadcast();
    }
}
