import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("LendingPool", function () {
  async function deployBasicFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const LendingPool = await ethers.getContractFactory("LendingPool");
    const lendingPool = await LendingPool.deploy();

    return { lendingPool, owner, otherAccount };
  }

  describe("Deployment", function () {});

  describe("Lendings", function () {
    describe("Validations", function () {
      it("Should trigger error if amount is less or equals to 0", async function () {
        const { lendingPool, otherAccount } = await loadFixture(deployBasicFixture);
 
        await expect(lendingPool.lendFrom(otherAccount.address, 0)).to.be.revertedWith(
          "You can lend amount which is greater then 0"
        );
      });

      it("Should trigger error if lender and borrower is the same", async function () {
        const { lendingPool, owner } = await loadFixture(deployBasicFixture);
 
        await expect(lendingPool.lendFrom(owner.address, 100)).to.be.revertedWith(
          "You cannot lend to yourself"
        );
      });

      it("Should trigger error if the account already is in a debt", async function () {
        const { lendingPool, otherAccount } = await loadFixture(deployBasicFixture);
 
        await lendingPool.lendFrom(otherAccount.address, 100);
 
        await expect(lendingPool.lendFrom(otherAccount.address, 200)).to.be.revertedWith(
          "You already lent from this account"
        );
      });
    });

    describe("Events", function () {
      it("Should emit the `Lend` event on lending", async function () {
        const amount = 100;
        const { lendingPool, owner, otherAccount } = await loadFixture(deployBasicFixture);

        await expect(lendingPool.lendFrom(otherAccount.address, amount))
          .to.emit(lendingPool, "Lend")
          .withArgs(owner.address, otherAccount.address, amount);

        const ownerDebt = await lendingPool.totalLendingAmountOf(owner.address);

        expect(ownerDebt).to.equals(amount);
      });
    });
  });

  describe("CloseLendings", function () {
    describe("Validations", function () {
      it("Should trigger error if there is no debt", async function () {
        const { lendingPool, otherAccount } = await loadFixture(deployBasicFixture);
 
        await expect(lendingPool.closeLendingFrom(otherAccount.address)).to.be.revertedWith(
          "There is no debt"
        );
      });
    });

    describe("Events", function () {
      it("Should emit the `LendingClosed` event on lending", async function () {
        const amount = 100;
        const { lendingPool, owner, otherAccount } = await loadFixture(deployBasicFixture);

        lendingPool.lendFrom(otherAccount.address, amount);

        await expect(lendingPool.connect(otherAccount).closeLendingFrom(owner.address))
          .to.emit(lendingPool, "LendingClosed")
          .withArgs(otherAccount.address, owner.address, amount);

        const ownerDebt = await lendingPool.totalLendingAmountOf(owner.address);

        expect(ownerDebt).to.equals(0);
      });
    });
  });
});
