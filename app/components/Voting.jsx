'use client';
import { useEffect, useState } from "react";
import { getWeb3 } from "../web3";
import { ethers } from "ethers";
import { abi, contractAddress } from "../constants/voting";

function voting() {
  const [nameVote, setNameVote] = useState("");

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

  const createVoteSystem = async () => {
    if (web3 && contract) {
      try {
        const tx = await contract.createVoteSystem(nameVote, voteList, timeDuration);
        await tx.wait();
        window.alert("fund created succesfully.");

        refreshVote();

        setNameVote("");
        setVoteList("")
        setTimeDuration("");
      } catch (error) {
        console.error("Error creating fundraiser", error);
      }
    }
  };

  return (
    <div>voting</div>
  )
}

export default voting