export const xyzABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "id",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "solanaWallet",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "evmWallet",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isConfirmed",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isDeleted",
                "type": "bool"
            }
        ],
        "name": "EntityAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "id",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "solanaWallet",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "evmWallet",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isConfirmed",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isDeleted",
                "type": "bool"
            }
        ],
        "name": "EntityUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string[]",
                "name": "_ids",
                "type": "string[]"
            },
            {
                "internalType": "string[]",
                "name": "_solanaWallets",
                "type": "string[]"
            },
            {
                "internalType": "address[]",
                "name": "_evmWallets",
                "type": "address[]"
            },
            {
                "internalType": "bool[]",
                "name": "_isConfirmed",
                "type": "bool[]"
            },
            {
                "internalType": "bool[]",
                "name": "_isDeleted",
                "type": "bool[]"
            }
        ],
        "name": "createEntries",
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
        "name": "entities",
        "outputs": [
            {
                "internalType": "string",
                "name": "id",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "solanaWallet",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "evmWallet",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "isConfirmed",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isDeleted",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fetchAllRecords",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "solanaWallet",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "evmWallet",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "isConfirmed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isDeleted",
                        "type": "bool"
                    }
                ],
                "internalType": "struct EntryVerificationV2.Entity[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_id",
                "type": "string"
            }
        ],
        "name": "fetchRecordById",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "solanaWallet",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "evmWallet",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "isConfirmed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isDeleted",
                        "type": "bool"
                    }
                ],
                "internalType": "struct EntryVerificationV2.Entity",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string[]",
                "name": "_ids",
                "type": "string[]"
            }
        ],
        "name": "markEntriesAsDeleted",
        "outputs": [],
        "stateMutability": "nonpayable",
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
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string[]",
                "name": "ids",
                "type": "string[]"
            },
            {
                "internalType": "string",
                "name": "_newSolanaWallet",
                "type": "string"
            }
        ],
        "name": "updateSolanaWallet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]