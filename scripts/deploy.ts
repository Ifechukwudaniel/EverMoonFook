import { ethers } from "hardhat";

async function main() {

  const EverMoon = await ethers.getContractFactory("EverMoon");
  const everMoonToken = await EverMoon.deploy();

  await everMoonToken.deployed();

  // console.log(
  //   `Lock with ${ethers.utils.formatEther(lockedAmount)}ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  // );
  console.log("Deployed ever moon")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
