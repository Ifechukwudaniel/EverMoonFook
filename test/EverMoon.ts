import { expect } from 'chai';
import { ethers } from 'hardhat';

describe("EverMoon", function () {
  let EverMoon: any;
  let everMoon: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;

  beforeEach(async function () {
    EverMoon = await ethers.getContractFactory("EverMoon");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    everMoon = await EverMoon.deploy();
    await everMoon.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await everMoon.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await everMoon.balanceOf(owner.address);
      expect(await everMoon.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await everMoon.transfer(addr1.address, 50);
      const addr1Balance = await everMoon.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await everMoon.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await everMoon.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await everMoon.balanceOf(owner.address);

      // Try to transfer 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        everMoon.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Insufficient Balance");

      // Owner balance shouldn't have changed.
      expect(await everMoon.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await everMoon.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await everMoon.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await everMoon.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await everMoon.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await everMoon.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await everMoon.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
