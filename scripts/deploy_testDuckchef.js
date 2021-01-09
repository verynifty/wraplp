// scripts/deploy.js
const { ethers, upgrades } = require("hardhat");
const chalk = require("chalk");
const fs = require("fs");
async function main() {
  const WrapLp = await deploy("WrapLp", ["https://gallery.verynifty.io/"]);
  const GovToken = await deploy("AirToken");
  const LpToken = await deploy("AirToken");

  await LpToken.mint(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    "5000000000000000000"
  );

  const DuckChef = await deploy("DuckChef", [
    GovToken.address,
    WrapLp.address,
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    "100000000000000000000",
    1,
    10,
  ]);

  // grant miner role to DuckChef
  await GovToken.grantRole(
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    DuckChef.address
  );

  // grant miner role to VNFT
  await WrapLp.grantRole(
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    WrapLp.address
  );

  await DuckChef.add(50, LpToken.address, true);
  console.log("Added LpToken pool to DuckChef");

  await LpToken.approve(WrapLp.address, "100000000000000000000000");
  await WrapLp.deposit(LpToken.address, "1000000000000000000");
  await WrapLp.deposit(LpToken.address, "2000000000000000000");
  console.log("Created first WrapLp");

  const nft = await WrapLp.getNFTInfo(0);
  console.log(nft._amount.toString());

  //   check that pool exists and is 0
  const pool = await DuckChef.poolInfo(0);
  console.log("pool ", pool);
  await DuckChef.register(0, 0);
  await DuckChef.register(0, 1);
  console.log("registerd to start getting rewards");

  // pass blocks
  for (i = 0; 1 > 10; i++) {
    await DuckChef.updatePool(0);

    await ethers.provider.send("evm_mine"); // add 1day
  }

  //   check rewards
  console.log("nft0", (await DuckChef.pendingToken(0, 0)).toString());
  console.log("nft1", (await DuckChef.pendingToken(0, 1)).toString());

  console.log(
    "DuckChef gov token balance:",
    (await GovToken.balanceOf(DuckChef.address)).toString()
  );

  console.log("nft0", (await DuckChef.pendingToken(0, 0)).toString());

  await DuckChef.withdraw(0, 0);

  console.log(
    "users gov tokens:",
    (
      await GovToken.balanceOf("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
    ).toString()
  );

  console.log("nft0", (await DuckChef.pendingToken(0, 0)).toString());
  console.log("nft1", (await DuckChef.pendingToken(0, 1)).toString());
  console.log(
    "DuckChef gov token balance:",
    (await GovToken.balanceOf(DuckChef.address)).toString()
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
