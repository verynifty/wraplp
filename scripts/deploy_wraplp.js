// scripts/deploy.js
const { ethers, upgrades } = require("hardhat");
const chalk = require("chalk");
const fs = require("fs");
async function main() {
  const WrapLp = await deploy("WrapLp", ["https://gallery.verynifty.io/"]);
  const LpToken = await deploy("DummyErc20");

  await LpToken.mint(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    "5000000000000000000"
  );

  console.log(
    "balance of token ",
    (
      await LpToken.balanceOf("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
    ).toString()
  );

  await LpToken.approve(WrapLp.address, "50000000000000000000000");

  await WrapLp.deposit(LpToken.address, "50");
  console.log("deposited into WrapLP and got NFT");

  const nftInfo = await WrapLp.getNFTInfo(0);
  console.log(nftInfo);

  console.log("Amount in NFT #0 ", nftInfo._amount.toString());

  await WrapLp.burn(0);

  console.log(
    "Users lp balance after we burned the NFT ",
    (
      await LpToken.balanceOf("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
    ).toString()
  );

  console.log(
    `Total supply of nfts after burned  ${(
      await WrapLp.totalSupply()
    ).toString()}`
  );
}

async function deploy(name, _args) {
  const args = _args || [];

  console.log(`📄 ${name}`);
  const contractArtifacts = await ethers.getContractFactory(name);
  const contract = await contractArtifacts.deploy(...args);
  console.log(
    chalk.cyan(name),
    "deployed to:",
    chalk.magenta(contract.address)
  );
  // fs.writeFileSync(`artifacts/${name}.address`, contract.address);
  console.log("\n");
  return contract;
}

main();
