# README.md for VestingContract Repository

## Overview
This repository contains a Solidity-based smart contract for implementing a vesting mechanism. It is designed to facilitate a robust and secure way of handling token vesting, suitable for various applications like DAOs, treasury management, and other decentralized financial services. The contract leverages the Superfluid protocol for real-time finance capabilities and is tested with a mainnet-forking approach to ensure reliability and security.

## Features
- **Vesting Contract**: A Solidity smart contract that handles the vesting of tokens over time.
- **Integration with Superfluid**: Utilizes the Superfluid protocol for real-time streaming of financial transactions.
- **Admin Role Management**: Leverages OpenZeppelin's AccessControl for role-based permissioning.
- **Event Emission**: Custom events for tracking the start, modification, and stopping of vesting flows.
- **Testing Framework**: Comprehensive tests written in JavaScript using Hardhat, Chai, and the Superfluid SDK.
- **Mainnet Forking**: Simulates real-world conditions for testing using Hardhat's network forking capabilities.

## Technology Stack
- Solidity (v0.8.14)
- Hardhat
- OpenZeppelin Contracts
- Superfluid Finance
- Ethers.js
- Chai for testing
- JavaScript (ES6+)

## Setup and Installation
### Clone the Repository
```bash
git clone https://github.com/pedrosgmagalhaes/superfluid-vesting-manager.git
```

### Install Dependencies
Navigate to the project directory and install the required npm packages:
```bash
yarn install
```

### Compile Contracts
Compile the Solidity contracts using Hardhat:
```bash
npx hardhat compile
```

### Testing
Compile the Solidity contracts using Hardhat:
```bash
npx hardhat test
```

The tests cover various scenarios and interactions with the VestingContract, ensuring its reliability and correctness.

## Deployment
For deployment guidelines and script examples, refer to the `deploy_scripts` directory (to be added as needed).

## Contributing
Contributions are welcome! Please read the contributing guidelines and code of conduct before making pull requests.

## License
This project is licensed under the MIT License - see the `LICENSE.md` file for details.
