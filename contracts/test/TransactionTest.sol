// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Transaction.sol";

contract TransactionTest is Test {
    Transaction transaction;

    address user1 = address(uint160(vm.envUint("user1")));
    address user2 = address(uint160(vm.envUint("user2")));

    function setUp() public {
        transaction = new Transaction();
    }

    function testTransaction() public {
        vm.startPrank(user1);
        transaction.makeTransaction(payable(user2));
        vm.stopPrank();

        Transaction.TransactionData[] memory txns = transaction.getTransactions(
            user1
        );

        require(txns.length > 0, "No transactions found for user1");
        assertEq(txns[0].receiver, user2);
        assertEq(txns[0].amount, 100);
        assertEq(txns[0].sender, user1);
    }
}
