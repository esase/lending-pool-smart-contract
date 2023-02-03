import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("LendingPool", function () {
  const lendingAmount = 100;
 
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
 
        await expect(lendingPool.lendFrom(owner.address, lendingAmount)).to.be.revertedWith(
          "You cannot lend or close lending to yourself"
        );
      });
    });

    describe("Events", function () {
      it("Should emit the `Lend` event", async function () {
        const { lendingPool, owner, otherAccount } = await loadFixture(deployBasicFixture);

        await expect(lendingPool.lendFrom(otherAccount.address, lendingAmount))
          .to.emit(lendingPool, "Lend")
          .withArgs(owner.address, otherAccount.address, lendingAmount);

        const ownerDebt = await lendingPool.totalLendingAmountOf(owner.address);

        expect(ownerDebt).to.equals(lendingAmount);
      });
    });
  });

  describe("AcceptLendings", function () {
    describe("Validations", function () {
        it("Should trigger error if amount is less or equals to 0", async function () {
          const { lendingPool, otherAccount } = await loadFixture(deployBasicFixture);
  
          await expect(lendingPool.acceptLendingFrom(otherAccount.address, 0)).to.be.revertedWith(
            "You can lend amount which is greater then 0"
          );
        });

        it("Should trigger error if lender and borrower is the same", async function () {
          const { lendingPool, owner } = await loadFixture(deployBasicFixture);
  
          await expect(lendingPool.acceptLendingFrom(owner.address, lendingAmount)).to.be.revertedWith(
            "You cannot lend or close lending to yourself"
          );
        });
    });


    describe("Events", function () {
      it("Should emit the `LendingAccepted`", async function () {
        const acceptedAmount = lendingAmount / 2;
        const { lendingPool, owner, otherAccount } = await loadFixture(deployBasicFixture);

        lendingPool.connect(otherAccount).lendFrom(owner.address, lendingAmount);

        await expect(lendingPool.connect(owner).acceptLendingFrom(otherAccount.address, acceptedAmount))
          .to.emit(lendingPool, "LendingAccepted")
          .withArgs(owner.address, otherAccount.address, acceptedAmount);

        const otherAccountDebtRest = await lendingPool.totalLendingAmountOf(otherAccount.address);

        expect(otherAccountDebtRest).to.equals(acceptedAmount);
      });
    });
  });
});
