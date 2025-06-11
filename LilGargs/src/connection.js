// src/connection.js
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import idl from './idl/lil_gargs.json';

// Replace this with your deployed program ID from Anchor
const programID = new PublicKey('8dPtzgCFEnQTAVYudMguN6avCXDhkRhAe8Nrb1gVHbm3');

// For devnet use clusterApiUrl('devnet'), for localnet use 'http://localhost:8899'
const network = clusterApiUrl('devnet');

const opts = {
  preflightCommitment: 'processed',
};

export const getProvider = (wallet) => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new AnchorProvider(connection, wallet, opts);
  return provider;
};

export const getProgram = (provider) => {
  return new Program(idl, programID, provider);
};
