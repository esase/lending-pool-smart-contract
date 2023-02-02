import { ethers } from "hardhat";

async function main() {
  const LendingPool = await ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy();

  await lendingPool.deployed();

  console.log(`Smart contract deployed to ${lendingPool.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
