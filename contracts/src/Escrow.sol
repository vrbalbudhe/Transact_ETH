// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

/**
 * @title Escrow
 * @dev A contract for Authenticating the transactions from both the ends
 */
contract Escrow {
    uint public escrowcount;

    // Enums for the Deal State
    enum EscrowState {
        Pending,
        Approved,
        Completed
    }

    // Structure to represent the transaction deal information
    struct Deal {
        address buyer;
        address seller;
        uint256 amount;
        bool buyerApproved;
        bool sellerApproved;
        EscrowState state;
    }

    mapping(uint256 => Deal) public escrows;

    // Events for better frontend interaction and blockchain traceability

    event EscrowCreated(
        uint indexed id,
        address buyer,
        address seller,
        uint amount
    );
    event Approved(uint indexed id, address approver);
    event FundsReleased(uint indexed id, address seller, uint amount);

    function createEscrow(address _seller) external payable returns (uint256) {
        require(msg.value > 0, "Amount must be > 0");
        escrowcount++;
        escrows[escrowcount] = Deal({
            buyer: msg.sender,
            seller: _seller,
            amount: msg.value,
            buyerApproved: false,
            sellerApproved: false,
            state: EscrowState.Pending
        });
        emit EscrowCreated(escrowcount, msg.sender, _seller, msg.value);
        return escrowcount;
    }

    function approve(uint _id) external {
        Deal storage e = escrows[_id];
        require(e.state == EscrowState.Pending, "Escrow not pending");

        if (msg.sender == e.buyer) {
            e.buyerApproved = true;
        } else if (msg.sender == e.seller) {
            e.sellerApproved = true;
        } else {
            revert("Not participant");
        }

        emit Approved(_id, msg.sender);

        if (e.buyerApproved && e.sellerApproved) {
            e.state = EscrowState.Approved;
            release(_id);
        }
    }

    function release(uint _id) internal {
        Deal storage e = escrows[_id];
        require(e.state == EscrowState.Approved, "Not approved yet");

        e.state = EscrowState.Completed;
        payable(e.seller).transfer(e.amount);

        emit FundsReleased(_id, e.seller, e.amount);
    }
}
