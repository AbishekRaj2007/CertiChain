import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import "@/types/ethereum.d.ts";

const WALLET_DISCONNECTED_KEY = "wallet_disconnected";

export interface WalletState {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!address;

  // Listen for account changes only (no auto-connect)
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected from MetaMask
          setAddress(null);
          setProvider(null);
          setSigner(null);
        } else if (address) {
          // Only update if already connected (user switched accounts in MetaMask)
          setAddress(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [address]);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask to connect your wallet");
      alert("Please install MetaMask!");
      return null;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access - this will prompt MetaMask to select account
      await browserProvider.send("eth_requestAccounts", []);
      
      const walletSigner = await browserProvider.getSigner();
      const walletAddress = await walletSigner.getAddress();

      setProvider(browserProvider);
      setSigner(walletSigner);
      setAddress(walletAddress);

      console.log("Connected wallet:", walletAddress);
      
      return { provider: browserProvider, signer: walletSigner, address: walletAddress };
    } catch (err: any) {
      const errorMessage = err.message || "Failed to connect wallet";
      setError(errorMessage);
      console.error("Wallet connection error:", err);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setError(null);
    // Clear any cached connection
    console.log("Wallet disconnected");
  }, []);

  return { 
    address, 
    provider,
    signer,
    connect, 
    disconnect,
    isConnecting, 
    isConnected,
    error 
  };
}
