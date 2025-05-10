# Smart Contract For Normal & Escrow System

A blockchain-based escrow and transaction system built with Solidity and Foundry.

## Overview

This project implements a secure escrow system for handling transactions between parties with built-in verification and security mechanisms. It provides:

- Smart contract-based escrow functionality
- Secure transaction processing
- Automated test suite
- Deployment scripts for various networks

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Smart Contracts](#smart-contracts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Ethereum Improvement Proposals](https://eips.ethereum.org/EIPS/eip-2335)
- Solidity ^0.8.13
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
forge install
```

3. Configure your `.env` file with the necessary API keys and private keys.

## Project Structure

```
contracts/
├── .github/               # GitHub workflows and configuration
├── broadcast/             # Deployment transaction records
├── cache/                 # Forge cache
├── lib/                   # Dependencies
├── out/                   # Compilation outputs
├── script/                # Deployment scripts
│   ├── Escrow.s.sol       # Escrow deployment script
│   └── Transaction.s.sol  # Transaction deployment script
├── src/                   # Smart contract source code
│   ├── Escrow.sol         # Escrow contract
│   └── Transaction.sol    # Transaction contract
├── test/                  # Test files
│   ├── Escrow.t.sol       # Escrow contract tests
│   └── Transaction.t.sol  # Transaction contract tests
├── .env                   # Environment variables
├── .gitignore             # Git ignore rules
├── .gitmodules            # Git submodules
├── foundry.toml           # Foundry configuration
└── README.md              # Project documentation
```

## Smart Contracts

### Escrow.sol

The Escrow contract manages the secure holding of funds between parties until predefined conditions are met. It provides:

- Deposit functionality
- Conditional release mechanisms
- Dispute resolution
- Timelock features

This contract implements:
- A state machine using `EscrowState` enum (Pending, Approved, Completed)
- A `Deal` struct to store transaction information
- Functions for creating escrows, approving transactions, and releasing funds
- Events for transaction traceability (`EscrowCreated`, `Approved`, `FundsReleased`)

### Transaction.sol

The Transaction contract handles the actual transfer of assets between parties with:

- Transaction validation
- Fee management
- Status tracking
- Event logging

Key features include:
- Direct ETH transfers between users
- Comprehensive transaction history tracking
- Functions to query transaction details by user
- Event emission for frontend integration (`TransactionRecorded`)

## Deployment

1. Configure your deployment environment in `.env`

2. Deploy to a local network:
```bash
anvil (run on separate terminal)
```
```bash
forge script script/Escrow.s.sol:EscrowScript --fork-url http://localhost:8545 --broadcast
```

3. Deploy to a testnet (e.g., Sepolia):
```bash
forge script script/Escrow.s.sol:EscrowScript --rpc-url $ALCHEMY_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.