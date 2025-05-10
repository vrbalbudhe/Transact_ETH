// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Transaction
 * @dev A contract for recording and processing real ETH transactions
 */
contract Transaction {
    // Events for better frontend interaction and blockchain traceability
    event TransactionRecorded(
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        uint256 timestamp
    );

    // Structure to represent a transaction
    struct TransactionData {
        address sender; // Address that sent the transaction
        address receiver; // Address that received the transaction
        uint256 amount; // Amount transferred (in wei)
        uint256 timestamp; // When the transaction was recorded
    }

    // Mapping from user address to their transaction history
    mapping(address => TransactionData[]) private transactionHistory;

    // Total transactions processed by the contract
    uint256 public totalTransactions;

    /**
     * @dev Processes and records a new transaction, transferring ETH to the receiver
     * @param receiver The address receiving the transaction
     */
    function makeTransaction(address payable receiver) public payable {
        // Validate inputs
        require(receiver != address(0), "Invalid receiver address");
        require(msg.value > 0, "Amount must be greater than zero");

        // Transfer ETH to the receiver
        (bool success, ) = receiver.call{value: msg.value}("");
        require(success, "Transfer failed");

        // Create a new transaction record
        TransactionData memory newTransaction = TransactionData({
            sender: msg.sender,
            receiver: receiver,
            amount: msg.value,
            timestamp: block.timestamp
        });

        // Store the transaction in the sender's history
        transactionHistory[msg.sender].push(newTransaction);

        // Also store in receiver's history for better tracking
        transactionHistory[receiver].push(newTransaction);

        // Update total transactions counter
        totalTransactions++;

        // Emit event for frontend tracking
        emit TransactionRecorded(
            msg.sender,
            receiver,
            msg.value,
            block.timestamp
        );
    }

    /**
     * @dev Retrieves the transaction history for a specific user
     * @param user The address to get transaction history for
     * @return An array of transaction records
     */
    function getTransactions(
        address user
    ) public view returns (TransactionData[] memory) {
        return transactionHistory[user];
    }

    /**
     * @dev Gets the number of transactions for a specific user
     * @param user The address to check
     * @return The count of transactions
     */
    function getTransactionCount(address user) public view returns (uint256) {
        return transactionHistory[user].length;
    }

    /**
     * @dev Gets details of a specific transaction for a user
     * @param user The address to check
     * @param index The transaction index in their history
     * @return Transaction details (sender, receiver, amount, timestamp)
     */
    function getTransactionDetails(
        address user,
        uint256 index
    ) public view returns (address, address, uint256, uint256) {
        require(
            index < transactionHistory[user].length,
            "Transaction index out of bounds"
        );
        TransactionData memory txn = transactionHistory[user][index];
        return (txn.sender, txn.receiver, txn.amount, txn.timestamp);
    }
}
