import { useState, useEffect } from "react";
import { contractService } from "@/services/contractService";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAddress(accounts[0] || null);
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  const checkConnection = async () => {
    const addr = await contractService.getAddress();
    setAddress(addr);
  };

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const signer = await contractService.connectWallet();
      const addr = await signer.getAddress();
      setAddress(addr);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  return { address, connect, isConnecting, error };
}
