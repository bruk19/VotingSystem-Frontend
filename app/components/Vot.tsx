"use client";
import { useEffect, useState } from "react";
import { getWeb3 } from "../web3";
import { ethers } from "ethers";
import { abi, contractAddress } from "../constants/voting";

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

function Vot() {
  const [nameVote, setNameVote] = useState<string>("");
  const [votedName, setVotedName] = useState<string>("");
  const [web3, setWeb3] = useState<ethers.providers.Web3Provider | undefined>(undefined);
  const [contract, setContract] = useState<ethers.Contract | undefined>(undefined);
  const [voteList, setVoteList] = useState<string[]>([]);
  const [timeDuration, setTimeDuration] = useState<number>(0);
  const [nameVoted, setNameVoted] = useState<string>("");

  useEffect(() => {
    async function initialize() {
      const web3Instance = getWeb3();
      if (web3Instance && typeof window !== "undefined" && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setWeb3(web3Instance);

        const signer = provider.getSigner();
        signer.then((resolvedSigner: ethers.providers.JsonRpcSigner) => {
          const contractInstance = new ethers.Contract(contractAddress, abi, resolvedSigner);
          setContract(contractInstance);
        }).catch((error) => {
          console.error("Error getting signer:", error);
        });
      }
    }
    initialize();
  }, []);

  const createVoteSystem = async () => {
    if (web3 && contract) {
      try {
        const tx = await contract.createVoteSystem(nameVote, voteList, timeDuration);
        await tx.wait();
        window.alert("Voting System is created successfully.");

        setNameVote("");
        setVoteList([]);
        setTimeDuration(0);
      } catch (error) {
        console.error("Error creating voting system", error);
      }
    }
  };

  const voting = async () => {
    if (web3 && contract) {
      try {
        const tx = await contract.voting(nameVote, votedName);
        await tx.wait();
        window.alert("Voting created successfully.");

      } catch (error) {
        console.error("Error Voting:", error);
      }
    }
  }

  return (
    <div>
      <h1>Voting System</h1>
      <div>
        <input type="text"
        placeholder="Enter Vote Name"
        value={nameVote}
        onChange={(e) => setNameVote(e.target.value)}
        />
        <input
          type="text"
          placeholder="Voted Name list"
          value={voteList.join(', ')}
          onChange={(e) => setVoteList(e.target.value.split(', '))}
        />
        <input
          type="number"
          placeholder="Duration days"
          value={timeDuration}
          onChange={(e) => setTimeDuration(Number(e.target.value))}
        />
        <button onClick={createVoteSystem}>Create Voting System</button>
      </div>
      <div>
        <input 
        type="text"
        placeholder="Enter Vote Name"
        value={nameVote}
        onChange={(e) => setNameVote(e.target.value)}
        />
        <input 
        type="text"
        placeholder="Voted Name"
        value={nameVoted}
        onChange={(e) => setNameVoted(e.target.value)}
        />

      </div>
    </div>
  )
}

export default Vot;