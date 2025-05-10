# TransactETH

A decentralized application for managing Ethereum transactions between accounts with both direct transfers and escrow-protected transfers on the Sepolia testnet.

![TransactETH-Homepage](../frontend/public/TransactETH-Assets/Images/TransactEth-Homepage.png)

## Features Showcase

- **Direct ETH Transfer**: Securely send ETH directly between Ethereum addresses
- **Escrow Protection**: Use a secure escrow contract for conditional transfers
- **Transaction History**: View complete history of transfers for your address
- **Sepolia Testnet Compatible**: Safely test all functionalities on Ethereum's Sepolia testnet
- **Web3 Integration**: Seamless connection with MetaMask and other Web3 wallets

## Technologies Used

```
- Blockchain: Ethereum (Sepolia Testnet)
- Smart Contracts: Solidity
- Frontend: React.js, Web3.js
- Testing: Foundry, ERC-2335: BLS12-381
- Development Environment: Foundry
```

## Features

1. Normal Eth Transaction
   ![TransactETH-Homepage](../frontend/public/TransactETH-Assets/Images/TransactEth-NormalPayment.png)

```txt
### Steps
1. Enter the Recipent Address & Amount in ETH
2. And Click on the Send ETH
3. Metamask Extension Will PopUp and Will Ask for the Confirmations.
4. Confirm, it
5. And Done, Enjoy the Process Until the Transaction is Completed.
```

![TransactETH-Homepage](../frontend/public/TransactETH-Assets/Images/TransactEth-EscrowPayment-Success.png)

2. Escrow Eth Transaction
   ![TransactETH-Homepage](../frontend/public/TransactETH-Assets/Images/TransactEth-EscrowPayment.png)

```
### Steps
1. Enter the Recipent Address & Amount in ETH
2. And Click on the Send ETH
3. Metamask Extension Will PopUp and Will Ask for the Confirmations.
4. Confirm, it
5. And Done, Enjoy the Process Until the Transaction is Completed.
```

![TransactETH-Homepage](../frontend/public/TransactETH-Assets/Images/TransactEth-Payment-Pending.png)
![TransactETH-Homepage](../frontend/public/TransactETH-Assets/Images/TransactEth-EscrowPayment-Success.png)

```
6. After Completion the Pop-up will be displayed on the bottom displaying the Pending Escrow Confirmation Box.
```

![TransactETH-Homepage](../frontend/public/TransactETH-Assets/Images/TransactEth-EscrowPayment-Pending.png)

```
7. Click on the [Approve Escrow] Button and Metamask will be pop up, confirm it and Wait for the Buyer Approval.
```

![TransactETH-Homepage](../frontend/public/TransactETH-Assets/Images/TransactEth-EscrowPayment-Buyer.png)

```
8. Now Since, it is confirmed on the Buyer Side, Now It Requires the Seller's Approval.
9. On Recipent's Side, The Pending Escrow Payment Box Will Be Displayed asking for the Approval.
```

![TransactETH-Homepage](../frontend/public/TransactETH-Assets/Images/TransactEth-EscrowPayment-sellerside-pending.png)

```
10. Click on, Approve Escrow
11. The Metamask Will be pop-up asking for the confirmations, confirm it.
12. After Successfully Done, We Can see the confirmation in the History Section.
```

![TransactETH-Homepage](../frontend/public/TransactETH-Assets/Images/TransactEth-EscrowPayment-sellerside-success.png)

3. History Section & Information Filter
```
> This Page Contains the Detailed Information About the Perticular Transaction and also redirects to the sepolia.etherscan.
```
![TransactETH-Homepage](../frontend/public/TransactETH-Assets/Images/TransactEth-History.png)

```
> It Also Consists of the Filter Component That Filters The Transaction Data Based on the different Parameters.
```
![TransactETH-Homepage](../frontend/public/TransactETH-Assets/Images/TransactEth-Filter.png)

## Smart Contracts

The project implements two primary smart contracts:

### 1. Transaction Contract

Handles standard ETH transfers between addresses with:

- Real-time ETH transfer with success verification
- Comprehensive transaction history tracking for both sender and receiver
- Detailed transaction data storage (sender, receiver, amount, timestamp)
- Event emission for frontend synchronization and blockchain traceability
- Robust error handling with clear failure messages
- Query functions for transaction history and statistics

```solidity
// Key functions:
function makeTransaction(address payable receiver) public payable
function getTransactions(address user) public view returns (TransactionData[] memory)
function getTransactionCount(address user) public view returns (uint256)
```

### 2. Escrow Contract

Manages secure escrow-based transfers with features:

- Multi-party approval system requiring consent from both buyer and seller
- State-based transaction flow (Pending → Approved → Completed)
- Secure fund storage during transaction negotiations
- Automatic fund release upon mutual approval
- Event tracking for each escrow stage (creation, approval, completion)
- Protection against unauthorized approvals and premature releases

```solidity
// Key functions:
function createEscrow(address _seller) external payable returns (uint256)
function approve(uint _id) external
```

Both contracts implement industry best practices for security, gas optimization, and user experience with clear event emissions for frontend integration.

## Usage Guide

### Normal ETH Transfer

1. Connect your MetaMask account to the application
2. Select "Normal Transaction" from the transaction type options
3. Enter the recipient's Ethereum address
4. Specify the ETH amount (e.g., 0.01 ETH)
5. Click "Send Transaction" to initiate the transfer
6. A pending status will appear while the transaction is being processed
7. Upon successful completion, transaction details will be displayed including:
   - Block number
   - Transaction hash
   - Gas used
8. Click on the Sepolia Etherscan link for more detailed information about your transaction

### Escrow Transfer

1. Connect your MetaMask account to the application
2. Select "Escrow Transaction" from the transaction type options
3. Enter the recipient's Ethereum address
4. Specify the ETH amount to be held in escrow
5. Click "Send Transaction" to initiate the escrow
6. An "Escrow Approval" dialog box will appear on the sender's side
7. Confirm the approval to proceed with the escrow
8. The recipient will receive a notification to confirm receipt
9. Once the recipient confirms, the transaction is finalized and funds are released

## Prerequisites

- Node.js (v16+) ( Recommendation: use v16+ or v20 version )
- WSL (Recommended)
- npm or Yarn
- Forgery Build
- ERC-2335: BLS12-381 (Ethereum Improvement Proposals)

```
> ⚠️ **WARNING**: PLEASE DON'T USE .ENV FOR SECRETS. USE ERC-2335: BLS12-381 INSTEAD.
```

- MetaMask browser extension
- Some Sepolia ETH (obtainable from faucets)

<!-- Installation instructions section intentionally omitted as requested -->

## Project Structure

```
contracts/
├── .github/
├── broadcast/
├── cache/
├── lib/
├── out/
├── script/
│   ├── Escrow.s.sol
│   └── Transaction.s.sol
├── src/
│   ├── Escrow.sol
│   └── Transaction.sol
├── test/
│   ├── Escrow.t.sol
│   └── Transaction.t.sol
├── .env
├── .gitignore
├── .gitmodules
├── foundry.toml
└── README.md
```

## Security Considerations

- Consider getting a professional audit before deploying to mainnet
- Don't Use the .env for the Secrets like Account PrivateKey
- Dont't Push Any Secret Credintials on the Github.

## Future Improvements

- Multi-signature escrow capabilities
- Implementing the scheduled transactions
- Integration with additional ERC20 tokens
- Mobile application version
- Advanced analytics dashboard
- Gas optimization improvements

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Ethereum Foundation
- Sepolia Testnet team
- OpenZeppelin for security patterns
- The Web3 community

---

_Note: This project is currently using the Sepolia testnet. Do not send real ETH to these contract addresses._
