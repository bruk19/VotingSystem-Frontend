"use client";

import { useEffect, useState } from "react";
import { getWeb3, setupWeb3 } from "../web3";
import { ethers } from "ethers";
import { abi, contractAddress } from "../constants/voting";
import { Address } from "web3";


declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

function Vot() {
  const [nameVote, setNameVote] = useState<string>("");
  const [votedName, setVotedName] = useState<string>("");
  const [contract, setContract] = useState<ethers.Contract | undefined>(undefined);
  const [voteList, setVoteList] = useState<string[]>([]);
  const [timeDuration, setTimeDuration] = useState<number>(0);
  const [nameVotes, setNameVotes] = useState<string>("");
  const [voteLists, setVoteLists] = useState<string[]>([]);
  const [voterAddress, setVoterAddress] = useState<string[]>([]);
  const [selectedVoteName, setSelectedVoteName] = useState<string | null>(null);
  const [displayedVoterAddress, setDisplayedVoterAddress] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [votingList, setVotingList] = useState<string | null>(null);
  const [displayVotedList, setDisplayVotedList] = useState<string[]>([]);
  const [votedList, setVotedList] = useState<string[]>([]);

  useEffect(() => {
    async function initialize() {
      await setupWeb3();
      const web3Instance = getWeb3();
      console.log(web3Instance);

      const signer = await web3Instance.getSigner();
      console.log(signer);

      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      setContract(contractInstance);

      const wallet = await signer.getAddress();
      setWalletAddress(wallet);
    }
    initialize();
  }, []);

  useEffect(() => {
    const getVoteNames = async () => {
      if (contract) {
        try {
          const allVotes = await contract.getVoteNames();
          setVoteLists(allVotes);
        } catch (error) {
          console.error("Error retrieving vote names:", error);
        }
      } else {
        console.error("Contract is not initialized.");
      }
    };

    getVoteNames();
    console.log("voteLists:", voteLists);
  }, [contract, setVoteLists]);

  useEffect(() => {
    const getVoterAddress = async () => {
      if (contract) {
        try {
          const allVoters = await contract.getVoterAddress();
          console.log("Retrieved votes:", allVoters);
          setVoterAddress(allVoters);
        } catch (error) {
          console.error("Error retrieving voters Address: ", error);
        }
      } else {
        console.error("Contract is not initialized.");
      }
    };

    getVoterAddress();
    console.log("voterAddress", voterAddress);
  }, [contract, setVoterAddress]);

  useEffect(() => {
    const getVotingTime = async () => {
      if (contract) {
        try {
          const time = await contract.getVotingTime();
          setTimeDuration(time);
        } catch (error) {
          console.error("Error retrieving voting timeDuration", error);
        }
      } else {
        console.error("Contract is not initialized time.");
      }
    };

    getVotingTime();
  }, [contract]);

 const connectWallet = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  } else {
    console.error("MetaMask is not detected.");
  }
};
  
  const createVoteSystem = async () => {
    if (contract && window.ethereum !== undefined) {
      try {
        const tx = await contract.createVoteSystem(nameVote, voteList, timeDuration);
        const receipt = await tx.wait();
        console.log("Voting system created successfully. Transaction receipt:", receipt);
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
    if (contract && window.ethereum !== undefined) {
      try {
        console.log("Voting for:", nameVotes, votedName);

        const allVotes = await contract.getVoteNames();
        console.log("Retrieved votes:", allVotes);

        const votedList = await contract.getVotedList(nameVotes);
        console.log("Retrieved voted list:", votedList);

        const tx = await contract.voting(nameVotes, votedName);
        const receipt = await tx.wait();
        console.log("Voted successfully. Transaction receipt:", receipt);

        window.alert("Voted successfully.");
        setNameVotes("");
        setVotedName("");
      } catch (error) {
        console.error("Error Voting:", error);
      }
    }
  };

  const getVoterAddress = async (voteName: string) => {
    if (contract) {
      try {
        const voterAddress = await contract.getVoterAddress(voteName);
        console.log("Retrieved voter address:", voterAddress);
        setSelectedVoteName(voteName);
        setDisplayedVoterAddress(voterAddress);
      } catch (error) {
        console.error("Error retrieving voter address:", error);
      }
    } else {
      console.error("Contract is not initialized.");
    }
  };

  const getVotedList = async (voteList: string[]) => {
  if (contract) {
    try {
      const list = await contract.getVotingList(voteList);
      console.log("Retrieved votes:", list);
      setVotedList(list);
    } catch (error) {
      console.error("Error retrieving voting list", error);
    }
  } else {
    console.error("Contract List is not initialized");
  }
};

  return (
  <div className="container mx-auto my-5">
     {walletAddress ? (
        <p className="text-lg font-bold mb-4">
          Account: {walletAddress.slice(0, 4)}...{walletAddress.slice(walletAddress.length - 4)}
        </p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      )}
      <h1 className="text-3xl mx-4 font-bold mb-4">Voting System</h1>
      <div>
        <input
          type="text"
          placeholder="Enter Vote Name"
          value={nameVote}
          onChange={(e) => setNameVote(e.target.value)}
        />
        <input
          type="text"
          placeholder="Voted Name list"
          value={voteList.join(', ')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const newName = e.target.value.trim();
              if (newName !== '') {
                setVoteList([...voteList, newName]);
                e.target.value = '';
              }
            }
          }}
          onChange={(e) => {
            const names = e.target.value.split(',').map((name) => name.trim());
            setVoteList(names);
          }}
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
          value={votedName}
          onChange={(e) => setVotedName(e.target.value)}
        />
        <button onClick={voting}>Vote</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h4 className="text-lg font-bold mb-2">List of votes</h4>
          <ul className="space-y-2">
            {voteLists.map((vote, index) => (
              <li
                key={index}
                onClick={() => getVoterAddress(vote)}
                className="bg-gray-100 rounded-md p-2 cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <span>{vote}</span>
              </li>
            ))}
          </ul>
           {votedList.length > 0 && (
  <div className="bg-white shadow-md rounded-lg p-4 mt-4">
    <h4 className="text-lg font-bold mb-2">Voted List</h4>
    <ul className="space-y-2">
      {votedList.map((vote, index) => (
        <li key={index} className="bg-gray-100 rounded-md p-2">
          {vote}
        </li>
      ))}
    </ul>
  </div>
)}
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <div>
            <h4 className="text-lg font-bold mb-2">Voting Time</h4>
            <p>Voting time duration: {timeDuration} days</p>
          </div>
        </div>
      </div>
      {selectedVoteName && displayedVoterAddress && (
        <div className="bg-white shadow-md rounded-lg p-4 mt-4">
          <p>Voter address for "{selectedVoteName}": {displayedVoterAddress}</p>
        </div>
      )}
    </div>
  );
}

export default Vot;
