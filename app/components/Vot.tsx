"use client";
import { useEffect, useState } from "react";
import { getWeb3, setupWeb3 } from "../web3";
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
  const [nameVotes, setNameVotes] = useState<string>("");

  useEffect(() => {
    async function initialize() {
      await setupWeb3();
      const web3Instance = getWeb3();
      console.log(web3Instance)
      if (web3Instance && typeof window !== "undefined" && window.ethereum) {

        const signer = await web3Instance.getSigner(); 
        console.log(signer)

        const contractInstance = new ethers.Contract(contractAddress, abi, signer);
        setContract(contractInstance);

        // signer.then((resolvedSigner: ethers.providers.JsonRpcSigner) => {
        //   const contractInstance = new ethers.Contract(contractAddress, abi, resolvedSigner);
        //   setContract(contractInstance);
        // })
      }
    }
    initialize();
  }, []);

 const createVoteSystem = async () => {
  if (contract && window.ethereum !== undefined) {
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
  } else {
    console.error("Contract is not initialized or MetaMask is not detected.");
  }
};

  const voting = async () => {
    if (window.ethereum !== undefined && contract) {
      try {
        const tx = await contract.voting(nameVote, votedName);
        await tx.wait();
        window.alert("Voting created successfully.");

        setNameVotes("");
        setNameVotes("");

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
        value={nameVotes}
        onChange={(e) => setNameVotes(e.target.value)}
        />
        <input 
        type="text"
        placeholder="Voted Name"
        value={nameVoted}
        onChange={(e) => setNameVoted(e.target.value)}
        />
        <button onClick={voting}>Vote</button>
      </div>
    </div>
  )
}

export default Vot;