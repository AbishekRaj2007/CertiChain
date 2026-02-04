import { ethers } from "ethers";

// Contract address (deployed on Sepolia)
const CONTRACT_ADDRESS = "0xBeF4EeDe07f7c40e24E523F0Ecc707F3B4621cEd";

// ABI matching the actual CertificateRegistry contract
const ABI = [
  "function admin() public view returns (address)",
  "function authorizedIssuers(address) public view returns (bool)",
  "function addIssuer(address _issuer) public",
  "function issueCertificate(string memory _certId, string memory _studentName, string memory _course, string memory _certHash) public",
  "function verifyCertificate(string memory _certId) public view returns (string memory, string memory, address, uint256, string memory)"
];

// Get contract instance (connects wallet + returns contract)
async function getContract() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
}

// Get read-only contract (no wallet prompt needed)
async function getReadOnlyContract() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
}

export const contractService = {
  getContract,
  getReadOnlyContract,

  async checkAdmin() {
    const contract = await getReadOnlyContract();
    const admin = await contract.admin();
    console.log("Admin:", admin);
    return admin;
  },

  async checkRole() {
    const contract = await getContract();
    const address = await contract.runner.getAddress();

    const admin = await contract.admin();
    const isIssuer = await contract.authorizedIssuers(address);

    if (address.toLowerCase() === admin.toLowerCase()) {
      console.log("Admin logged in");
      return "admin";
    } else if (isIssuer) {
      console.log("Issuer logged in");
      return "issuer";
    } else {
      console.log("Normal user");
      return "user";
    }
  },

  async getAddress() {
    if (!window.ethereum) return null;
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts[0] || null;
    } catch (e) {
      return null;
    }
  },

  async checkNetwork() {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    // Sepolia Chain ID is 11155111n
    if (network.chainId !== 11155111n) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      } catch (error) {
        throw new Error("Please switch to Sepolia Testnet manually.");
      }
    }
  },

  async issueCertificate(certId, studentName, course, certHash) {
    try {
      await this.checkNetwork();
      const contract = await getContract();

      console.log("Issuing certificate...");

      const tx = await contract.issueCertificate(
        certId,
        studentName,
        course,
        certHash
      );

      console.log("Transaction sent:", tx.hash);

      await tx.wait();

      console.log("✅ Certificate issued successfully!");
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error("Issue failed:", error.reason || error.message);
      throw error;
    }
  },

  async verifyCertificate(certId) {
    await this.checkNetwork();
    const contract = await getReadOnlyContract();
    
    try {
      const result = await contract.verifyCertificate(certId);
      
      return {
        studentName: result[0],
        course: result[1],
        issuer: result[2],
        issueDate: new Date(Number(result[3]) * 1000).toLocaleString(),
        certHash: result[4]
      };
    } catch (e) {
      console.error("Verification failed:", e);
      return null;
    }
  },

  async addIssuer(issuerAddress) {
    await this.checkNetwork();
    const contract = await getContract();
    const tx = await contract.addIssuer(issuerAddress);
    await tx.wait();
    console.log("Issuer added:", issuerAddress);
    return tx;
  }
};
