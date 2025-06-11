import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "../idl/lil_gargs.json"; // <- Ensure this path is correct

const programID = new PublicKey("8dPtzgCFEnQTAVYudMguN6avCXDhkRhAe8Nrb1gVHbm3");

export const useProgram = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  if (!wallet) return null;

  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });

  const program = new Program(idl, programID, provider);

  return { program, provider, wallet };
};
