const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const Devox = await hre.ethers.getContractFactory("Devox");
  const devox = await Devox.deploy();
  await devox.waitForDeployment();

  const address = await devox.getAddress();
  console.log("Devox deployed to:", address);

  // Read ABI from Hardhat's artifacts
  const artifactPath = path.join(__dirname, "../artifacts/contracts/Devox.sol/Devox.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const abi = artifact.abi;

  // Write address and abi to client
  const outputPath = path.join(__dirname, "../../client/src/utils/contract-config.json");
  fs.writeFileSync(outputPath, JSON.stringify({ address, abi }, null, 2));

  console.log(`Contract config written to: ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
