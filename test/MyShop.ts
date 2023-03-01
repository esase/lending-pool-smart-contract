import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyShop", function () {
  async function deployBasicFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const MyShop = await ethers.getContractFactory("MyShop");
    const myShop = await MyShop.deploy();

    return { myShop, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { myShop, owner } = await deployBasicFixture();

      expect(await myShop.owner()).to.equal(owner.address);
    });
  });

  describe("Paying", function () {
    describe("Events", function () {
      it("Should emit the `Paying` event", async function () {
        const { myShop, otherAccount } = await loadFixture(deployBasicFixture);
        const amount = ethers.utils.parseEther("1.0");
        const service = "test-service";
 
        await expect(myShop.connect(otherAccount).payForService(service, {
          value: amount,
        }))
          .to.emit(myShop, "Paying")
          .withArgs(otherAccount.address, amount);

        const createdService = await myShop.payments(otherAccount.address, 0);

        expect(createdService.service).to.equals(service);
        expect(createdService.amount).to.equals(amount);
      });
    });
  });

  describe("Withdraw", function () {
    describe("Validations", function () {
      it("Should trigger error if sender is not the contract owner", async function () {
        const { myShop, otherAccount } = await loadFixture(deployBasicFixture);

        await expect(myShop.connect(otherAccount).withdraw()).to.be.revertedWith(
          "Only owner can perform the action"
        );
      });
    });

    describe("Events", function () {
      it("Should emit the `Paying` event", async function () {
        const { myShop, owner, otherAccount } = await loadFixture(deployBasicFixture);
        const ownerInitialBalance = await owner.getBalance(); 
        const amount = ethers.utils.parseEther("1.0");

        await myShop.connect(otherAccount).payForService("test-service", {
          value: amount,
        });

        await expect(myShop.withdraw())
          .to.emit(myShop, "Paying")
          .withArgs(owner.address, amount);

          expect(await owner.getBalance()).to.greaterThan(ownerInitialBalance);
          expect(await myShop.provider.getBalance(myShop.address)).to.equal(0);
      });
    });
  });
});
