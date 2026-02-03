import { ethers } from "ethers";

// Human-readable ABI for the contract
const CONTRACT_ABI = [
  "function issueCertificate(string memory _id, string memory _studentName, string memory _courseName, string memory _ipfsHash) public",
  "function verifyCertificate(string memory _id) public view returns (string memory, string memory, string memory, address, uint256, bool)",
  "function revokeCertificate(string memory _id) public",
  "event CertificateIssued(string indexed certificateId, string studentName, address indexed issuer)",
  "event CertificateRevoked(string indexed certificateId)"
];

// Placeholder address - user will update this after deployment
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; 

export const contractService = {
  async connectWallet() {
    if (!window.ethereum) throw new Error("No crypto wallet found. Please install MetaMask.");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return signer;
  },

  async getAddress() {
    if (!window.ethereum) return null;
    try {
      // Use eth_accounts to check existing connection WITHOUT prompting
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
          params: [{ chainId: '0xaa36a7' }], // 11155111 in hex
        });
      } catch (error) {
         throw new Error("Please switch to Sepolia Testnet manually.");
      }
    }
  },

  async issueCertificate(certId, studentName, courseName, ipfsHash) {
    await this.checkNetwork();
    const signer = await this.connectWallet();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tx = await contract.issueCertificate(certId, studentName, courseName, ipfsHash);
    return tx;
  },

  async verifyCertificate(certId) {
    await this.checkNetwork();
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    try {
      const result = await contract.verifyCertificate(certId);
      // Check if the certificate actually exists (student name not empty)
      if (!result[0]) return null;
      
      return {
        studentName: result[0],
        courseName: result[1],
        ipfsHash: result[2],
        issuer: result[3],
        timestamp: new Date(Number(result[4]) * 1000).toLocaleString(),
        isValid: result[5]
      };
    } catch (e) {
      console.error("Verification failed:", e);
      return null;
    }
  },
  
  async revokeCertificate(certId) {
    await this.checkNetwork();
    const signer = await this.connectWallet();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tx = await contract.revokeCertificate(certId);
    return tx;
  }
};
