const abi = [
  {
    anonymous: false,

    inputs: [
      {
        indexed: false,

        internalType: 'uint256',

        name: 'chainID',

        type: 'uint256',
      },
    ],

    name: 'NeighborChainBound',

    type: 'event',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: false,

        internalType: 'uint256',

        name: 'proposalId',

        type: 'uint256',
      },
    ],

    name: 'ProposalCanceled',

    type: 'event',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: true,

        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },

      {
        indexed: true,

        internalType: 'bytes32',

        name: 'previousAdminRole',

        type: 'bytes32',
      },

      {
        indexed: true,

        internalType: 'bytes32',

        name: 'newAdminRole',

        type: 'bytes32',
      },
    ],

    name: 'RoleAdminChanged',

    type: 'event',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: true,

        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },

      {
        indexed: true,

        internalType: 'address',

        name: 'account',

        type: 'address',
      },

      {
        indexed: true,

        internalType: 'address',

        name: 'sender',

        type: 'address',
      },
    ],

    name: 'RoleGranted',

    type: 'event',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: true,

        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },

      {
        indexed: true,

        internalType: 'address',

        name: 'account',

        type: 'address',
      },

      {
        indexed: true,

        internalType: 'address',

        name: 'sender',

        type: 'address',
      },
    ],

    name: 'RoleRevoked',

    type: 'event',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: false,

        internalType: 'uint256',

        name: 'termID',

        type: 'uint256',
      },

      {
        indexed: false,

        internalType: 'address',

        name: 'voter',

        type: 'address',
      },
    ],

    name: 'VoterChanged',

    type: 'event',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: false,

        internalType: 'uint256',

        name: 'oldDelay',

        type: 'uint256',
      },

      {
        indexed: false,

        internalType: 'uint256',

        name: 'newDelay',

        type: 'uint256',
      },
    ],

    name: 'VotingDelayChanged',

    type: 'event',
  },

  {
    anonymous: false,

    inputs: [
      {
        indexed: false,

        internalType: 'uint256',

        name: 'newTerm',

        type: 'uint256',
      },

      {
        indexed: false,

        internalType: 'uint256',

        name: 'electionTerm',

        type: 'uint256',
      },

      {
        indexed: false,

        internalType: 'uint256',

        name: 'newRatio',

        type: 'uint256',
      },
    ],

    name: 'VotingRatioChanged',

    type: 'event',
  },

  {
    inputs: [],

    name: 'DEFAULT_ADMIN_ROLE',

    outputs: [
      {
        internalType: 'bytes32',

        name: '',

        type: 'bytes32',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: 'flags',

        type: 'uint256',
      },
    ],

    name: 'adminPause',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256[]',

        name: 'chainIDs',

        type: 'uint256[]',
      },
    ],

    name: 'bindNeighborChains',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: 'proposalId',

        type: 'uint256',
      },
    ],

    name: 'cancel',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: 'proposalId',

        type: 'uint256',
      },

      {
        internalType: 'uint8',

        name: 'support',

        type: 'uint8',
      },

      {
        internalType: 'uint8',

        name: 'v',

        type: 'uint8',
      },

      {
        internalType: 'bytes32',

        name: 'r',

        type: 'bytes32',
      },

      {
        internalType: 'bytes32',

        name: 's',

        type: 'bytes32',
      },
    ],

    name: 'castVoteBySig',

    outputs: [
      {
        internalType: 'uint256',

        name: '',

        type: 'uint256',
      },
    ],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'address[]',

        name: '_newVoters',

        type: 'address[]',
      },

      {
        internalType: 'uint256',

        name: '_newTerm',

        type: 'uint256',
      },
    ],

    name: 'changeVoters',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: 'proposalId',

        type: 'uint256',
      },
    ],

    name: 'execute',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: 'proposalId',

        type: 'uint256',
      },

      {
        internalType: 'address',

        name: 'voter',

        type: 'address',
      },
    ],

    name: 'getReceipt',

    outputs: [
      {
        components: [
          {
            internalType: 'bool',

            name: 'hasVoted',

            type: 'bool',
          },

          {
            internalType: 'uint8',

            name: 'support',

            type: 'uint8',
          },

          {
            internalType: 'uint96',

            name: 'votes',

            type: 'uint96',
          },
        ],

        internalType: 'struct CrossMultiSignDao.Receipt',

        name: '',

        type: 'tuple',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },
    ],

    name: 'getRoleAdmin',

    outputs: [
      {
        internalType: 'bytes32',

        name: '',

        type: 'bytes32',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },

      {
        internalType: 'address',

        name: 'account',

        type: 'address',
      },
    ],

    name: 'grantRole',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },

      {
        internalType: 'address',

        name: 'account',

        type: 'address',
      },
    ],

    name: 'hasRole',

    outputs: [
      {
        internalType: 'bool',

        name: '',

        type: 'bool',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: 'proposalId',

        type: 'uint256',
      },

      {
        internalType: 'address',

        name: 'account',

        type: 'address',
      },
    ],

    name: 'hasVoted',

    outputs: [
      {
        internalType: 'bool',

        name: '',

        type: 'bool',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [],

    name: 'idle',

    outputs: [
      {
        internalType: 'bool',

        name: '',

        type: 'bool',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'contract IVotes',

        name: '_tokenAddress',

        type: 'address',
      },

      {
        internalType: 'uint256',

        name: '_votingDelay',

        type: 'uint256',
      },

      {
        internalType: 'address',

        name: '_owner',

        type: 'address',
      },

      {
        internalType: 'uint256',

        name: '_ratio',

        type: 'uint256',
      },
    ],

    name: 'initialize',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: 'chainID',

        type: 'uint256',
      },
    ],

    name: 'nonces',

    outputs: [
      {
        internalType: 'uint256',

        name: '',

        type: 'uint256',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [],

    name: 'paused',

    outputs: [
      {
        internalType: 'uint256',

        name: '',

        type: 'uint256',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: 'proposalId',

        type: 'uint256',
      },
    ],

    name: 'proposalDeadline',

    outputs: [
      {
        internalType: 'uint256',

        name: '',

        type: 'uint256',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: 'fromChainID',

        type: 'uint256',
      },

      {
        internalType: 'uint256',

        name: 'toChainID',

        type: 'uint256',
      },

      {
        internalType: 'uint8',

        name: 'kindId',

        type: 'uint8',
      },

      {
        internalType: 'uint256',

        name: 'voteTerm',

        type: 'uint256',
      },

      {
        internalType: 'uint256',

        name: 'nonce',

        type: 'uint256',
      },

      {
        internalType: 'bytes',

        name: 'action',

        type: 'bytes',
      },

      {
        internalType: 'bytes32',

        name: 'descriptionHash',

        type: 'bytes32',
      },
    ],

    name: 'propose',

    outputs: [
      {
        internalType: 'uint256',

        name: '',

        type: 'uint256',
      },
    ],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: 'blockNumber',

        type: 'uint256',
      },
    ],

    name: 'quorum',

    outputs: [
      {
        internalType: 'uint256',

        name: '',

        type: 'uint256',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'bytes32',

        name: '',

        type: 'bytes32',
      },

      {
        internalType: 'address',

        name: '',

        type: 'address',
      },
    ],

    name: 'renounceRole',

    outputs: [],

    stateMutability: 'pure',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'bytes32',

        name: 'role',

        type: 'bytes32',
      },

      {
        internalType: 'address',

        name: 'account',

        type: 'address',
      },
    ],

    name: 'revokeRole',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: '_votingDelay',

        type: 'uint256',
      },
    ],

    name: 'setVotingDelay',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: 'proposalId',

        type: 'uint256',
      },
    ],

    name: 'state',

    outputs: [
      {
        internalType: 'enum ProposalState',

        name: '',

        type: 'uint8',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'bytes4',

        name: 'interfaceId',

        type: 'bytes4',
      },
    ],

    name: 'supportsInterface',

    outputs: [
      {
        internalType: 'bool',

        name: '',

        type: 'bool',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [],

    name: 'term',

    outputs: [
      {
        internalType: 'uint256',

        name: '',

        type: 'uint256',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [
      {
        internalType: 'uint256',

        name: '_ratio',

        type: 'uint256',
      },

      {
        internalType: 'uint256',

        name: '_newTerm',

        type: 'uint256',
      },
    ],

    name: 'updateVotingRatio',

    outputs: [],

    stateMutability: 'nonpayable',

    type: 'function',
  },

  {
    inputs: [],

    name: 'votingDelay',

    outputs: [
      {
        internalType: 'uint256',

        name: '',

        type: 'uint256',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },

  {
    inputs: [],

    name: 'votingRatio',

    outputs: [
      {
        internalType: 'uint256',

        name: '',

        type: 'uint256',
      },
    ],

    stateMutability: 'view',

    type: 'function',
  },
];
export default abi