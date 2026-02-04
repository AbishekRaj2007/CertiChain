import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      removeAllListeners: () => void;
    };
  }
}

export interface WalletConnection {
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
  address: string;
}
