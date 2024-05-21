import { ethers } from "ethers";

let web3;
let provider;

async function setupWeb3() {
  if (window.ethereum) {
    web3 = new ethers.providers.Web3Provider(window.ethereum);
    const networkId = (await web3.getNetwork()).chainId;
    if (networkId != 11155111) {
      window.alert("please switch to Sepolia Testnet");
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
  }
  else {
    alert("MetaMask not detected! Please install MetaMask.")
  }
}

setupWeb3();