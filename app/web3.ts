import { ethers } from "ethers";
import type { Provider, AbstractProvider, BrowserProvider } from "ethers";
declare global {
  interface Window {
    ethereum?: any;
  }
}

let web3: BrowserProvider;
let provider: AbstractProvider ;

 export async function setupWeb3(): Promise<void> {
  let signer = null;

  if (window.ethereum == null) {
 console.log("MetaMask not installed; using read-only defaults")
    provider = ethers.getDefaultProvider()
  } else {
     web3 = new ethers.BrowserProvider(window.ethereum)
    signer = await web3.getSigner();

    const networkId = (await web3.getNetwork()).chainId;
    if (Number(networkId) != 11155111) {
       window.alert("Please switch to Polygon Sepolia Testnet");
     }
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }
}

export function getWeb3(): BrowserProvider {
  return web3;
}