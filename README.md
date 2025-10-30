# Web3 Certifier

## About
Web3 Certifier is an open-source certification platform which offers exams for the verification of someone's knowledge in a wide range of subjects.

## How it works
Web3 Certifier is based on Blockchain technology, and all the data involved in the certification process is stored on-chain.

## AI Agent
There is a discord bot with AI capabilities that can talk to users in natural language. This agent can give recommendations based on someone's interests and summarize the skills of a user based on their certificates.

## Requirements
Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- [Foundryup](https://book.getfoundry.sh/getting-started/installation)
- [Python 2.7+](https://www.python.org/downloads/)
- [Node.js 23+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [pnpm](https://pnpm.io/installation)

> Note for Windows Users: WSL 2 is required.


## How to run this repository
### To run the AI Agent:
1. Go to the `packages/agent` directory and create a `.env` file based on the `.env.example` file.
2. From the root directory execute the command: 
   - `yarn install`
3. Then from the `packages/agent` directory execute the commands:
   - `pnpm i`
   - `pnpm build`
   - `pnpm start`

### To run the front-end:
1. Go to the `packages/nextjs` directory and create a `.env` file based on the `.env.example` file.
2. From the root directory execute the commands: 
   - `yarn install`
   - `yarn start`

### To deploy the smart contract:
1. Go to the `packages/foundry` directory and create a `.env` file based on the `.env.example` file.
2. From the `packages/foundry` directory execute the commands: 
   - `yarn deploy --network sepolia`
   - `yarn verify --network sepolia` or `forge verify-contract 0x8c008619305dC27009d0c81E204C30F7c9726E9B contracts/Certifier.sol:Certifier --compiler-version "0.8.24+commit.e11b9ed9" --chain 42161 --constructor-args 0x000000000000000000000000694aa1769357215de4fac081bf1f309adc325306 --watch --etherscan-api-key <key>`
3. For deployments you need to change the "DEPLOY_CONTRACT", "UPGRADE_CERTIFIER_CONTRACT", "UPGRADE_REWARD_FACTORY_CONTRACT" and the proxy addresses in the .env file.
4. To verify the reward contract do: `make deploy-reward-{network}`. Look at Makefile!

### To redeploy the subgraph:
Delete the `packages/the-graph` directory and go to <a href="https://thegraph.com/studio/">https://thegraph.com/studio/</a>. There you can follow the instructions to create a new subgraph.


NOTES  
forge install openzeppelin/openzeppelin-contracts-upgradeable --no-commit
forge install openzeppelin/openzeppelin-contracts@v5.3.0 --no-commit
exam for submission testing: 61
exam for reward testing: 67, 40
exam submitted, corrected not claimed NFT yet: 61 on sepolia