# 🗳️ Devox — Decentralized Polling dApp

_Devox_ is a fully decentralized polling application built as part of my **Proof of Knowledge** portfolio. It enables users to create and vote on polls directly on the blockchain — ensuring transparency, immutability, and censorship resistance.

---

## 📌 Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [Smart Contracts Overview](#smart-contracts-overview)
4. [Testing](#testing)
5. [Frontend](#frontend)
6. [License](#license)

---

## ⚙️ Installation

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Hardhat](https://hardhat.org/)

### Clone the Repository
```bash
git clone https://github.com/welersonassis/devox-dapp.git
cd devox-dapp
```

### Install Dependencies
```bash
cd contract
npm install
```

---

## 🚀 Usage

### Running a Local Hardhat Node
```bash
npx hardhat node
```

### Deploying Contracts Locally
```bash
npx hardhat ignition deploy ignition/modules/Devox.js --network localhost
```
---

## 🔍 Smart Contracts Overview

### 🏛 Devox.sol
- Implements a solidity smart contract .
- Allows users to create polls, and costumize the number of options.
- Users can see and vote on created polls.
- Includes validation checks to only allow users vote once per each poll.
---

## 🧪 Testing

Run contract tests using Hardhat:
```bash
npx hardhat test
```
---
## 🎨 Frontend

The frontend is built with React and interacts with the smart contract using `Wagmi`.

### Install Dependencies
```bash
cd client
npm install
```

### Running the Frontend
```bash
npm run dev
```

This will start the frontend at `http://localhost:5173/`.

---
## 📜 License
MIT License. See `LICENSE` for details.
