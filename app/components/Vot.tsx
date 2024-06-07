'use client';

import { useEffect, useState } from 'react';
import { getWeb3, setupWeb3 } from '../web3';
import { ethers } from 'ethers';
import { abi, contractAddress } from '../constants/voting';

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

function Vot() {
  const [nameVote, setNameVote] = useState<string>('');
  const [votedName, setVotedName] = useState<string>('');
  const [contract, setContract] = useState<ethers.Contract | undefined>(
    undefined
  );
  const [voteList, setVoteList] = useState<string[]>([]);
  const [timeDuration, setTimeDuration] = useState<string | null>(null);
  const [nameVotes, setNameVotes] = useState<string>('');
  const [voteLists, setVoteLists] = useState<string[]>([]);
  const [selectedVoteName, setSelectedVoteName] = useState<string | null>(null);
  const [displayedVoterAddress, setDisplayedVoterAddress] = useState<string[]>(
    []
  );
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [selectedVotedList, setSelectedVotedList] = useState<string[]>([]);
  const [selectVotedValue, setSelectVotedValue] = useState<
    { voterName: string; voteCount: number }[]
  >([]);

  useEffect(() => {
    async function initialize() {
      await setupWeb3();
      const web3Instance = getWeb3();
      console.log(web3Instance);

      const signer = await web3Instance.getSigner();
      console.log(signer);

      const contractInstance = new ethers.Contract(
        contractAddress,
        abi,
        signer
      );
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
          console.error('Error retrieving vote names:', error);
        }
      } else {
        console.error('Contract is not initialized.');
      }
    };

    getVoteNames();
    console.log('voteLists:', voteLists);
  }, [contract, setVoteLists]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      console.error('MetaMask is not detected.');
    }
  };

  const createVoteSystem = async () => {
    if (contract && window.ethereum !== undefined) {
      try {
        const tx = await contract.createVoteSystem(
          nameVote,
          voteList,
          timeDuration
        );
        const receipt = await tx.wait();
        console.log(
          'Voting system created successfully. Transaction receipt:',
          receipt
        );
        window.alert('Voting System is created successfully.');

        setNameVote('');
        setVoteList([]);
        setTimeDuration(0);
      } catch (error) {
        console.error('Error creating voting system', error);
      }
    } else {
      console.error('Contract is not initialized or MetaMask is not detected.');
    }
  };

  const voting = async () => {
    if (contract && window.ethereum !== undefined) {
      try {
        const allVotes = await contract.getVoteNames();
        console.log('Retrieved votes:', allVotes);

        const votedList = await contract.getVotedList(nameVotes);
        console.log('Retrieved voted list:', votedList);

        const tx = await contract.voting(nameVotes, votedName);
        const receipt = await tx.wait();
        console.log('Voted successfully. Transaction receipt:', receipt);

        window.alert('Voted successfully.');
        setNameVotes('');
        setVotedName('');
      } catch (error) {
        console.error('Error Voting:', error);
      }
    }
  };

  const getVoterAddress = async (voteName: string) => {
    if (contract) {
      try {
        const voterAddress = await contract.getVoterAddress(voteName);
        setSelectedVoteName(voteName);
        setDisplayedVoterAddress(voterAddress);
        await getVotingTime(voteName);
        const votedList = await getVotedList(voteName);
        const votedNames = votedList.map(String);
        await getVoteValue(voteName, votedNames);
      } catch (error) {
        console.error('Error retrieving voter address:', error);
      }
    } else {
      console.error('Contract is not initialized.');
    }
  };

  const getVotingTime = async (name: string) => {
    if (contract) {
      try {
        const time = await contract.getVotingTime(name);
        const votingDateString = time.toString();
        const votingDate = new Date(Number(votingDateString) * 1000);
        const timeDiff = votingDate.getTime() - new Date().getTime();

        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        setTimeDuration(daysDiff.toString());
        if (daysDiff <= 0) {
          setTimeDuration(null);
        } else {
          setTimeDuration(daysDiff.toString());
        }
      } catch (error) {
        console.error('Error retrieving voting timeDuration', error);
      }
    } else {
      console.error('Contract is not initialized time.');
    }
  };

  const getVotedList = async (voteName: string) => {
    if (contract) {
      try {
        const votedList = await contract.getVotedList(voteName);
        console.log('Voted list:', votedList);
        setSelectedVotedList(votedList);
        return votedList;
      } catch (error) {
        console.error('Error retrieving voted list:', error);
        return [];
      }
    } else {
      console.error('Contract is not initialized getVotedList');
      return [];
    }
  };

  const getVoteValue = async (voteName: string, votedNames: string[]) => {
    if (contract) {
      try {
        const votedValues = await Promise.all(
          votedNames.map(async (voter) => {
            const votedAmount = await contract.getVoteValue(voteName, voter);
            console.log('votedValue for', voter, 'is', votedAmount);
            return {
              voterName: voter,
              voteCount: Number(votedAmount),
            };
          })
        );
        setSelectVotedValue(votedValues);
      } catch (error) {
        console.error('Error retrieving voted list:', error);
      }
    } else {
      console.error('Contract is not initialized getVotedValue');
    }
  };

  return (
    <div className="container mx-auto my-1">
      {walletAddress ? (
        <p className="text-lg font-bold mb-4 absolute mt-3 top-4 right-6">
          Account: {walletAddress.slice(0, 4)}...
          {walletAddress.slice(walletAddress.length - 4)}
        </p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
        >
          Connect Wallet
        </button>
      )}
      <h1 className="text-3xl mx-4 font-bold my-5 mb-4">Voting System</h1>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <input
            className="border-gray-300 border rounded px-3 py-2 flex-1"
            type="text"
            placeholder="Enter Vote Name"
            value={nameVote}
            onChange={(e) => setNameVote(e.target.value)}
          />
          <input
            className="border-gray-300 border rounded px-3 py-2 flex-1"
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
              const names = e.target.value
                .split(',')
                .map((name) => name.trim());
              setVoteList(names);
            }}
          />
          <input
            className="border-gray-300 border rounded px-3 py-2 flex-1"
            type="number"
            placeholder="Duration days"
            value={timeDuration}
            onChange={(e) => setTimeDuration(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={createVoteSystem}
          >
            Create Voting System
          </button>
        </div>
      </div>
      <div className="space-y-4 mt-4">
        <div className="flex items-center space-x-4">
          <input
            className="border-gray-300 border rounded px-3 py-2 flex-1"
            type="text"
            placeholder="Enter Vote Name"
            value={nameVotes}
            onChange={(e) => setNameVotes(e.target.value)}
          />
          <input
            className="border-gray-300 border rounded px-3 py-2 flex-1"
            type="text"
            placeholder="Voted Name"
            value={votedName}
            onChange={(e) => setVotedName(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={voting}
          >
            Vote
          </button>
        </div>
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
        </div>
        <div className="bg-white shadow-md p-4">
          <div className="p-2 mt-1 mt-3 bg-white shadow-md mb-2">
            <h4 className="font-bold">Voting Time</h4>
            {timeDuration !== null ? (
              <p>Voting time duration: {timeDuration} days lefts</p>
            ) : (
              <p>Loading voting time...</p>
            )}
          </div>
          <div className="mb-2">
            <h4 className="font-bold p-2 mt-1 mt-3 bg-white shadow-md">
              Voted List for "{selectedVoteName}":
            </h4>
            {selectVotedValue.length > 0 ? (
              <div>
                {selectVotedValue.map((voter, index) => (
                  <div key={index} className="mt-3">
                    <p className="font-bold">Voter: {voter.voterName}</p>
                    <p>Voted Amount: {voter.voteCount}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No votes found for the selected option.</p>
            )}
          </div>
          <div className="mb-2">
            {selectedVoteName && displayedVoterAddress && (
              <div className="bg-white shadow-md">
                <p className="font-bold p-2 mt-1">
                  Voter address for "{selectedVoteName}":
                </p>
                <div className="p-2">
                  {displayedVoterAddress
                    .toString()
                    .split(',')
                    .map((line, index) => (
                      <p key={index} className={index > 0 ? 'mt-2' : ''}>
                        {line}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vot;
