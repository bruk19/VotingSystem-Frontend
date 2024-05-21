export const contractAddress = "0x3Cc5Ee2A44Fd6D06fe739A071818F67cCF9bD761";
export const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "voteName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string[]",
          "name": "_voteNameList",
          "type": "string[]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_timeDuration",
          "type": "uint256"
        }
      ],
      "name": "_createVoteSystem",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_voter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_voteName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_votedName",
          "type": "string"
        }
      ],
      "name": "_voting",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_voteName",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "_votedNameList",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_timeDuration",
          "type": "uint256"
        }
      ],
      "name": "createVoteSystem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "createdVoteList",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVoteNames",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_voteName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_votedName",
          "type": "string"
        }
      ],
      "name": "getVoteValue",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_voteName",
          "type": "string"
        }
      ],
      "name": "getVoterAddress",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_voteName",
          "type": "string"
        }
      ],
      "name": "getVoterNumber",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "voteInfo",
      "outputs": [
        {
          "internalType": "address",
          "name": "voteCreater",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timeDuration",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isTimeDuration",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isVoted",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_voteName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_votedName",
          "type": "string"
        }
      ],
      "name": "voting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]