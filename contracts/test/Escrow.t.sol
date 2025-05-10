// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Escrow.sol";

contract EscrowTest is Test {
    Escrow escrow;
    address buyer = address(uint160(vm.envUint("PRIVATE_KEY_B")));
    address seller = address(uint160(vm.envUint("PRIVATE_KEY_S")));

    function setUp() public {
        escrow = new Escrow();
        vm.deal(buyer, 10 ether);
    }

    function testCreateAndApproveFlow() public {
        vm.prank(buyer);
        uint id = escrow.createEscrow{value: 0.01 ether}(seller);

        vm.prank(buyer);
        escrow.approve(id);

        vm.prank(seller);
        escrow.approve(id);

        assertEq(seller.balance, 0.01 ether);
    }
}
