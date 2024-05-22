import { ethers } from "ethers";

declare var window: any;

let web3: ethers.providers.Web3Provider | undefined;
let provider: providers.JsonRpcProvider | undefined;

async function setupWeb3(): Promise<void> {
  if (window.ethereum) {
    web3 = new ethers.BrowserProvider(window.ethereum);
    const networkId = (await web3.getSigner()).chainId;
    if (networkId !== 11155111) {
      window.alert("Please switch to Sepolia Testnet");
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
  } else {
    alert("MetaMask not detected! Please install MetaMask.");
  }
}

setupWeb3();

export function getWeb3(): ethers.providers.Web3Provider | undefined {
  return web3;
}