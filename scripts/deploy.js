// scripts/deploy.js
const { ethers, upgrades } = require("hardhat");
const chalk = require("chalk");
const fs = require("fs");
async function main() {
  const WrapLp = await deploy("WrapLp", ["https://api.wraplp.com/"]);
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
