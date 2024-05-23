import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

let web3: ethers.providers.Web3Provider | undefined;

async function setupWeb3(): Promise<void> {
  if (typeof window !== "undefined" && window.ethereum) {
    web3 = new ethers.BrowserProvider(window.ethereum);
    const signer = web3.getSigner();
    const network = await web3.getNetwork();
    const networkId = network.chainId;
    
    if (networkId !== 11155111) {
      window.alert("Please switch to Sepolia Testnet");
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
  } else {
    console.error("MetaMask not detected! Please install MetaMask.");
  }
}

if (typeof window !== "undefined") {
  setupWeb3();
}

export function getWeb3(): ethers.providers.Web3Provider | undefined {
  return web3;
}