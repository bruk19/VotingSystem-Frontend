import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

let web3: ethers.providers.Web3Provider | undefined;
let provider: ethers.providers.Web3Provider | undefined;

 export async function setupWeb3(): Promise<void> {
  let signer = null;

  if (window.ethereum == null) {
 console.log("MetaMask not installed; using read-only defaults")
    provider = ethers.getDefaultProvider()
  } else {
     web3 = new ethers.BrowserProvider(window.ethereum)
    signer = await web3.getSigner();

    const networkId = (await web3.getNetwork()).chainId;
    if (networkId != 11155111) {
       window.alert("Please switch to Polygon Sepolia Testnet");
     }
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }
}

export function getWeb3(): ethers.providers.Web3Provider | undefined {
  return web3;
}