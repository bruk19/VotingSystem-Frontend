import { useEffect } from 'react'
import { getWeb3 } from "../web3";
import { abi, contractAddress } from "../constants/voting";

function voting() {

  useEffect(() => {
    async function initialize() {
      const web3Instance = getWeb3();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setWeb3(web3Instance);

      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      setContract(contractInstance);
    }
    initialize();
  }, []);
  return (
    <div>voting</div>
  )
}

export default voting