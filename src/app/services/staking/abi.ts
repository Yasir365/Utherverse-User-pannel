import { Idl } from '@project-serum/anchor/dist/cjs/idl';

export type Abi = {
  version: string;
  name: string;
  instructions: any;
  accounts: {
    name: string;
    type: any;
  }[];
  errors: { code: number; name: string; msg: string }[];
};

export const ABI: Idl = {
  version: '0.1.0',
  name: 'staking_program',
  instructions: [
    {
      name: 'initialize',
      accounts: [
        { name: 'signer', isMut: true, isSigner: true },
        { name: 'admin', isMut: true, isSigner: false },
        { name: 'tokenVaultAccount', isMut: true, isSigner: false },
        { name: 'poolInfo', isMut: true, isSigner: true },
        { name: 'mint', isMut: false, isSigner: false },
        { name: 'tokenProgram', isMut: false, isSigner: false },
        { name: 'systemProgram', isMut: false, isSigner: false },
      ],
      args: [
        { name: 'lockTime', type: 'u64' },
        { name: 'apy', type: 'u64' },
        { name: 'apyDenomiator', type: 'u64' },
        { name: 'roiType', type: 'u64' },
      ],
    },
    {
      name: 'stake',
      accounts: [
        { name: 'signer', isMut: true, isSigner: true },
        { name: 'stakeInfoAccount', isMut: true, isSigner: false },
        { name: 'stakeAccount', isMut: true, isSigner: false },
        { name: 'poolInfo', isMut: false, isSigner: false },
        { name: 'userTokenAccount', isMut: true, isSigner: false },
        { name: 'mint', isMut: false, isSigner: false },
        { name: 'tokenProgram', isMut: false, isSigner: false },
        { name: 'associatedTokenProgram', isMut: false, isSigner: false },
        { name: 'systemProgram', isMut: false, isSigner: false },
      ],
      args: [
        { name: 'stakeCounter', type: 'u64' },
        { name: 'amount', type: 'u64' },
        { name: 'autostake', type: 'bool' },
      ],
    },
    {
      name: 'destake',
      accounts: [
        { name: 'signer', isMut: true, isSigner: true },
        { name: 'tokenVaultAccount', isMut: true, isSigner: false },
        { name: 'stakeInfoAccount', isMut: true, isSigner: false },
        { name: 'poolInfo', isMut: false, isSigner: false },
        { name: 'stakeAccount', isMut: true, isSigner: false },
        { name: 'userTokenAccount', isMut: true, isSigner: false },
        { name: 'mint', isMut: false, isSigner: false },
        { name: 'associatedTokenProgram', isMut: false, isSigner: false },
        { name: 'tokenProgram', isMut: false, isSigner: false },
        { name: 'systemProgram', isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: 'calculateRewards',
      accounts: [
        { name: 'signer', isMut: true, isSigner: true },
        { name: 'stakeInfoAccount', isMut: true, isSigner: false },
        { name: 'poolInfo', isMut: false, isSigner: false },
        { name: 'stakeAccount', isMut: true, isSigner: false },
        { name: 'tokenVaultAccount', isMut: true, isSigner: false },
        { name: 'userTokenAccount', isMut: true, isSigner: false },
        { name: 'mint', isMut: false, isSigner: false },
        { name: 'associatedTokenProgram', isMut: false, isSigner: false },
        { name: 'tokenProgram', isMut: false, isSigner: false },
        { name: 'systemProgram', isMut: false, isSigner: false },
      ],
      args: [],
      returns: 'u64',
    },
    {
      name: 'claimRewards',
      accounts: [
        { name: 'signer', isMut: true, isSigner: true },
        { name: 'stakeInfoAccount', isMut: true, isSigner: false },
        { name: 'poolInfo', isMut: false, isSigner: false },
        { name: 'stakeAccount', isMut: true, isSigner: false },
        { name: 'tokenVaultAccount', isMut: true, isSigner: false },
        { name: 'userTokenAccount', isMut: true, isSigner: false },
        { name: 'mint', isMut: false, isSigner: false },
        { name: 'associatedTokenProgram', isMut: false, isSigner: false },
        { name: 'tokenProgram', isMut: false, isSigner: false },
        { name: 'systemProgram', isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: 'restakeRewards',
      accounts: [
        { name: 'signer', isMut: true, isSigner: true },
        { name: 'stakeInfoAccount', isMut: true, isSigner: false },
        { name: 'poolInfo', isMut: false, isSigner: false },
        { name: 'stakeAccount', isMut: true, isSigner: false },
        { name: 'tokenVaultAccount', isMut: true, isSigner: false },
        { name: 'userTokenAccount', isMut: true, isSigner: false },
        { name: 'mint', isMut: false, isSigner: false },
        { name: 'associatedTokenProgram', isMut: false, isSigner: false },
        { name: 'tokenProgram', isMut: false, isSigner: false },
        { name: 'systemProgram', isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: 'updatePoolInfo',
      accounts: [
        { name: 'admin', isMut: true, isSigner: true },
        { name: 'poolInfo', isMut: true, isSigner: false },
      ],
      args: [
        { name: 'admin', type: 'publicKey' },
        { name: 'tokenVault', type: 'publicKey' },
        { name: 'lockTime', type: 'u64' },
        { name: 'apy', type: 'u64' },
        { name: 'apyDenominator', type: 'u64' },
        { name: 'roiType', type: 'u64' },
        { name: 'token', type: 'publicKey' },
      ],
    },
    {
      name: 'adminWithdraw',
      accounts: [
        { name: 'signer', isMut: true, isSigner: true },
        { name: 'tokenVaultAccount', isMut: true, isSigner: false },
        { name: 'poolInfo', isMut: false, isSigner: false },
        { name: 'adminTokenAccount', isMut: true, isSigner: false },
        { name: 'mint', isMut: false, isSigner: false },
        { name: 'associatedTokenProgram', isMut: false, isSigner: false },
        { name: 'tokenProgram', isMut: false, isSigner: false },
        { name: 'systemProgram', isMut: false, isSigner: false },
      ],
      args: [{ name: 'value', type: 'u64' }],
    },
    {
      name: 'derivePda',
      accounts: [
        { name: 'signer', isMut: true, isSigner: true },
        { name: 'poolInfo', isMut: false, isSigner: false },
      ],
      args: [{ name: 'inputNumber', type: 'u64' }],
    },
  ],
  accounts: [
    {
      name: 'PoolInfo',
      type: {
        kind: 'struct',
        fields: [
          { name: 'admin', type: 'publicKey' },
          { name: 'tokenVault', type: 'publicKey' },
          { name: 'lockTime', type: 'u64' },
          { name: 'apy', type: 'u64' },
          { name: 'apyDenominator', type: 'u64' },
          { name: 'roiType', type: 'u64' },
          { name: 'token', type: 'publicKey' },
        ],
      },
    },
    {
      name: 'StakeInfo',
      type: {
        kind: 'struct',
        fields: [
          { name: 'stakedAmount', type: 'u64' },
          { name: 'depositTimestamp', type: 'i64' },
          { name: 'stakeAtSlot', type: 'u64' },
          { name: 'isStaked', type: 'bool' },
          { name: 'endTime', type: 'u64' },
          { name: 'autostake', type: 'bool' },
          { name: 'unclaimedRewards', type: 'u64' },
          { name: 'lastInteractionTime', type: 'u64' },
          { name: 'nextClaimTime', type: 'u64' },
          { name: 'poolInfo', type: 'publicKey' },
          { name: 'totalClaimed', type: 'u64' },
          { name: 'totalClaimCycles', type: 'u64' },
          { name: 'claimCyclesPassed', type: 'u64' },
          { name: 'stakeSeed', type: 'u64' },
        ],
      },
    },
  ],
  errors: [
    { code: 6000, name: 'IsStaked', msg: 'Token are already staked' },
    { code: 6001, name: 'NotStaked', msg: 'Tokens not staked' },
    { code: 6002, name: 'NoTokens', msg: 'No tokens to stake' },
    { code: 6003, name: 'InvalidRoiType', msg: 'Invalid ROI type provided.' },
    { code: 6004, name: 'InvalidLockTime', msg: 'Invalid lock time provided.' },
    { code: 6005, name: 'InvalidAmount', msg: 'Invalid amount to stake.' },
  ],
};