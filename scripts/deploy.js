import hre from "hardhat";

async function main() {
  console.log("Deploying CertificateRegistry contract...");

  const certificateRegistry = await hre.ethers.deployContract("CertificateRegistry");

  await certificateRegistry.waitForDeployment();

  console.log(
    `CertificateRegistry deployed to: ${certificateRegistry.target}`
  );
  
  console.log("----------------------------------------------------");
  console.log("deployment successful! Please update client/src/services/contractService.js with this address.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
