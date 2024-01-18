<br />
<div align="center">
  <a href="https://github.com/teyweikiet/immutable-stackupinvaders-bounty">
    <img src="site/favicon.ico" alt="Logo" width="50" height="50">
  </a>

  <h1 align="center" style="border-bottom: 0;">StackUp Invaders (twk415)</h1>

  <p align="center">
    A Web3 game built with Immutable!
    <br />
    <a href="https://immutable-stackupinvaders-bounty.netlify.app/"><strong>View Demo</strong></a>
    |
    <a href="https://explorer.testnet.immutable.com/address/0xcecbb48a29c8a347d7f53c03ac7d6a7e487958e0"><strong>Block Explorer</strong></a>
    <br />
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#upgrades-implemented">Upgrades Implemented</a></li>
      </ul>
    </li>
    <li>
      <a href="#built-with">Built With</a>
      <ul>
        <li><a href="#backend">Backend</a></li>
        <li><a href="#frontend">Frontend</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#deploying-nft-smart-contract">Deploying NFT Smart Contract</a></li>
        <li><a href="#running-locally">Running locally</a></li>
        <li><a href="#deploying-to-netlify">Deploying to Netlify</a></li>
      </ul>
    </li>
  </ol>
</details>

## About the project

This is a submission for [Upgrade StackUp Invaders Bounty](https://platform.campus.dev/learners/campaigns/gamer-onboarding-with-immutable-passport/quests/bounty-upgrade-stackup-invaders-2508).

### Upgrades Implemented

- Reading player's NFT inventory and resume level (refer `getNftByAccount` function [here](/site/login.js#L1148-L167))

  - this helps ensure each player has only one NFT
  - player will be able to start game with their upgraded spaceship and resume with their previous level based on their NFT metadata (refer `getUserLevel` function [here](/site/login.js), how it's called in `setup` function [here](/site/sketch.js) & how`setup` function is called in `draw` function [here](/site/sketch.js) when userProfile changes)

- Minting just one NFT for every new player and refreshing metadata on subsequent levels up

  - we mint NFT for Level 1 badge (refer `mintNft` function [here](/site/login.js))
  - on subsequent levels, we call immutable api to refresh metadata (refer codes [here](/functions/upgradeNft/index.mjs))

- Increasing difficult of game by increasing the points needed to collect to uplevel

  - now user need to collect at least 100 points to level up instead of 50 points (refer [here](/site/Player.js))

- Having more achievement milestones

  - now user can achieve up to level 4 (refer [here](/site/Player.js))

- Increasing security by

  - moving grantMinterRole logic to backend (serverless function) to prevent wallet private key from being exposed to the public (refer `grantMinterRole` function [here](/functions/grantMinterRole/index.mjs))
  - moving refreshMetadata logic to backend (serverless function) to prevent immutable API key from being exposed to the public (refer [here](/functions/uphradeNft/index.mjs))

## Built With

### Backend

- Immutable for deployment of ERC721 contract

- Netlify function for `grant minter role` & `refresh metadata` functionalities

### Frontend

- Immutable Passport for authentication

- ethers.js for utils to interact with smart contract

- p5.js for creating game

- Netlify for hosting [frontend site](https://immutable-stackupinvaders-bounty.netlify.app/)

## Getting Started

### Installation

1. Clone the repo
```sh
git clone https://github.com/teyweikiet/immutable-stackupinvaders-bounty
```

2. Install dependencies
```sh
npm install
```

### Deploying NFT Smart Contract

1. Follow steps [here](https://platform.campus.dev/learners/campaigns/gamer-onboarding-with-immutable-passport/quests/quest-2-capstone-build-a-game-with-the-immutable-zkevm-part-i) to deploy NFT smart contract

### Running locally

1. Copy and modify .env accordingly
```sh
cp .env.example .env
```

2. Search for `TODO: Replace` in `/site` folder to replace with appropriate values

3. Start server locally
```sh
npm run start:local
```

### Deploying to Netlify

1. Deploy to Netlify
```sh
npm run deploy:netlify
```

