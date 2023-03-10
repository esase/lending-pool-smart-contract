import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyErc20Token", function () {
  const tokenName = 'SasToken';
  const tokenSymbol = 'SAS';
  const initialSupply = 1000;

  async function deployBasicFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const MyErc20Token = await ethers.getContractFactory("MyErc20Token", {
    });
 
    const myErc20Token = await MyErc20Token.deploy(tokenName, tokenSymbol, initialSupply);

    return { myErc20Token, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set token name and token symbol", async function () {
      const { myErc20Token, owner } = await deployBasicFixture();

      expect(await myErc20Token.name()).to.equal(tokenName);
      expect(await myErc20Token.symbol()).to.equal(tokenSymbol);
      expect(await myErc20Token.owner()).to.equal(owner.address);
      expect(await myErc20Token.balanceOf(owner.address)).to.equal(initialSupply);
      expect(await myErc20Token.totalSupply()).to.equal(initialSupply);
    });
  });
});
