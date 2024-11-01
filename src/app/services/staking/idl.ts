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

export const IDL: Idl = {
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
        { name: 'apyDenominator', type: 'u64' },
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
      args: [{ name: 'stakeCounter', type: 'u64' }],
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
      args: [{ name: 'stakeCounter', type: 'u64' }],
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
      args: [{ name: 'stakeCounter', type: 'u64' }],
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
      args: [{ name: 'stakeCounter', type: 'u64' }],
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
          { name: 'inProcess', type: 'bool' },
        ],
      },
    },
  ],
  errors: [
    { code: 6000, name: 'IsStaked', msg: 'Token are already staked' },
    { code: 6001, name: 'NotStaked', msg: 'Tokens not staked' },
    { code: 6002, name: 'NoTokens', msg: 'No tokens to stake' },
    {
      code: 6003,
      name: 'InvalidRoiType',
      msg: 'Invalid ROI type: must be 0, 1, or 2.',
    },
    {
      code: 6004,
      name: 'NoReward',
      msg: "You don't have any rewards to claim.",
    },
    {
      code: 6005,
      name: 'Wait',
      msg: 'Too Early: You need to wait for claim cycle.',
    },
    {
      code: 6006,
      name: 'NoClaim',
      msg: "Your auto stake feature is enabled, you can't claim periodic rewards",
    },
    {
      code: 6007,
      name: 'StillLocked',
      msg: 'You can not destake before the Lock Period is over',
    },
    {
      code: 6008,
      name: 'Unauthorized',
      msg: 'You are not authorized to call this function',
    },
    {
      code: 6009,
      name: 'TimeOver',
      msg: 'Claim Time is over, You can not claim now',
    },
    {
      code: 6010,
      name: 'AlreadyClaimed',
      msg: 'All the rewards have already been Claimed.',
    },
    {
      code: 6011,
      name: 'InvalidApyDenominator',
      msg: 'Invalid APY denominator: cannot be zero.',
    },
    {
      code: 6012,
      name: 'InvalidApy',
      msg: 'Invalid APY %: cannot be zero.',
    },
    {
      code: 6013,
      name: 'InvalidLockTime',
      msg: 'Invalid lock period: cannot be zero.',
    },
    {
      code: 6014,
      name: 'UnauthorizedAdmin',
      msg: 'Unauthorized admin address.',
    },
    {
      code: 6015,
      name: 'IsStakeSeed',
      msg: 'Stake Seed Already in use.',
    },
    { code: 6016, name: 'InvalidAmount', msg: 'Invalid Stake Amount.' },
    {
      code: 6017,
      name: 'AlreadyInProcess',
      msg: 'Please Wait, Another Transaction is already Processing',
    },
    {
      code: 6018,
      name: 'InvalidCycleCount',
      msg: 'Cycle count exceed i32 range',
    },
  ],
};
