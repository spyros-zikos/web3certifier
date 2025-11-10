.PHONY: build deploy generate-abis deploy-verify test verify

# install dependencies
install:
	forge install openzeppelin/openzeppelin-contracts --no-commit; forge install smartcontractkit/chainlink-brownie-contracts@1.3.0 --no-commit
	
# fork: setup-anvil-wallet
# 	anvil --fork-url ${FORK_URL} --chain-id 31337

# Test with a fork
fork-sepolia:
	forge test --fork-url sepolia -vv --via-ir
fork-celo:
	forge test --fork-url celo -vv --via-ir

# Test Xp Prizes
test-xp-prizes:
	forge test --mc XpPrizesTest --via-ir

# Build the project
build:
	forge build --build-info --build-info-path out/build-info/ --optimizer-runs 1 --via-ir

# Generate TypeScript ABIs
generate-abis:
	node scripts-js/generateTsAbis.js

# Verify contracts
verify:
	forge script script/VerifyAll.s.sol --optimizer-runs 1 --ffi --rpc-url $(RPC_URL) --via-ir

-include .env

# Deploy and verify certifier or reward factory
deploy-sepolia:
	@forge script script/Deploy.s.sol:DeployScript --rpc-url sepolia --account $(ETH_KEYSTORE_ACCOUNT) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) --verifier-url https://api.etherscan.io/v2/api?chainid=11155111 --optimizer-runs 1 --via-ir -vvvv
deploy-celo:
	@forge script script/Deploy.s.sol:DeployScript --rpc-url celo --account $(ETH_KEYSTORE_ACCOUNT) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) --verifier-url https://api.etherscan.io/v2/api?chainid=42220 --optimizer-runs 1 --via-ir -vvvv

# Deploy and verify xp prizes contract
deploy-xp-prizes-sepolia:
	@forge script script/XpPrizes/DeployXpPrizes.s.sol:DeployXpPrizes --rpc-url sepolia --account $(ETH_KEYSTORE_ACCOUNT) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) --verifier-url https://api.etherscan.io/v2/api?chainid=11155111 --optimizer-runs 1 --via-ir -vvvv
deploy-xp-prizes-celo:
	@forge script script/XpPrizes/DeployXpPrizes.s.sol:DeployXpPrizes --rpc-url celo --account $(ETH_KEYSTORE_ACCOUNT) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) --verifier-url https://api.etherscan.io/v2/api?chainid=42220 --optimizer-runs 1 --via-ir -vvvv


# Verify the Reward contract
deploy-reward-sepolia:
	@forge script script/Reward/DeployReward.s.sol:DeployReward --rpc-url sepolia --account $(ETH_KEYSTORE_ACCOUNT) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) --verifier-url https://api.etherscan.io/v2/api?chainid=11155111 --optimizer-runs 1 --via-ir -vvvv
deploy-reward-celo:
	@forge script script/Reward/DeployReward.s.sol:DeployReward --rpc-url celo --account $(ETH_KEYSTORE_ACCOUNT) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) --verifier-url https://api.etherscan.io/v2/api?chainid=42220 --optimizer-runs 1 --via-ir -vvvv