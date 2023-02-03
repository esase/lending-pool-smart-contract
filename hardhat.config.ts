import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
      version: '0.8.17',
      settings: {
          optimizer: {
              enabled: true,
              runs: 1000000,
          },
      },
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    coinmarketcap: '8fddfefc-e706-4355-8c1f-0d4b907f440e',
  },
};

export default config;
