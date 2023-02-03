# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```


# Installation

1. `npm install --save-dev hardhat`
2. `npx hardhat`


# Usage

1. Compiling `npx hardhat compile`
2. Testing `npx hardhat test`
3. Deploy to test local network `npx hardhat run scripts/deploy-lending-pool.ts --network localhost`
4. Run a local node `npx hardhat node`
5. Interaction with the network `npx hardhat console`

example:

```
const LendingPool = await ethers.getContractFactory("LendingPool");
const lendingPool = await LendingPool.deploy();

console.log(await lendingPool.lendFrom('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 100));

console.log(await lendingPool.totalLendingAmount());

```

get events:

```
const LendingPool = await ethers.getContractFactory("LendingPool");
const lendingPool = await LendingPool.deploy();

console.log(await lendingPool.lendFrom('0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', 100));

const receiveFilter = lendingPool.filters.Lend('0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', null);
const signer = await ethers.getSigner();
const logs = await signer.provider.getLogs(receiveFilter);
console.log(logs);
```