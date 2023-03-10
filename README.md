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

# Openzeppelin

1. https://www.npmjs.com/package/@openzeppelin/contracts

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

# Optimizations tricks:

1. Don't specify default values without necessary: 
```
uint a; <-- by default has 0 as default and it's cheaper
uint a = 0; <--- the same, it has 0 as default, but it a bit costly because of necessary operation.

```

2. Try to define variables with the same type on by one, like:

```
uint128 a; <-- they will be kept in the memory more efficiently (it's like a packing into a word into the memory)
uint128 b;
uint256 c;

```

incorrect:

```
uint128 a; 
uint256 c; <--- we break the chain
uint128 b;
```

3. Better to use `uint` instead of `uint8` e.g, because the `uint` might occupy the whole word in the memory, and `uint8` will only occupy the some part of the word and will be cut. But for arrays better 
to use smaller uint size like `uint8`


4. We need to try use static data for state vars and do not calculate them dynamically. eg:

```
bytes32 hash = 0x....... <- consumes low amount of gas (a correct way)
bytes32 hash = keccak256(abi.encodePacked("test")) <-- will consume more gas (incorrect way)
```

5. Don't use temp variables without necessary. eg:

```
address _from = msg.sender; <- here we introduce a not necessary variable, which also consumes gas (incorrect way)
require(_from != address(0), "zero address");


require(msg.sender != address(0), "zero address"); <-- we don't use any extra vars here (a correct way)
```

6. If it possible use `mapping` instead `arrays` (especially array with dynamic length), because it's cheaper.

7. Don't use a big amount of small functions, better to use bigger functions.

8. Don't frequently change a state variable. eg, in cycles. Better to use a temp variable
and once the cycle is finished working we can change that state variable assigning the temp var's value it it.

9. Don't store big amount of data in smart contracts. The better way is use some off chain approaches.