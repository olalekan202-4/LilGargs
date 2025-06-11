import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useProgram } from "../utils/useProgram"; // Corrected path assuming it's in the same directory
import { web3 } from "@project-serum/anchor";

export default function MintSection({ showMessage }) { // Accept showMessage prop
  const anchorSetup = useProgram();

  const handleMint = async () => {
    if (!anchorSetup) {
      showMessage("Connect your wallet first!", "error"); // Use showMessage
      return;
    }

    const { program, wallet } = anchorSetup;

    try {
      const mintKeypair = web3.Keypair.generate();

      await program.methods
        .mintNft() // ← Ensure this matches your actual Anchor method name for minting
        .accounts({
          authority: wallet.publicKey,
          mint: mintKeypair.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([mintKeypair])
        .rpc();

      showMessage("NFT minted successfully!", "success"); // Use showMessage
    } catch (err) {
      console.error("Mint failed:", err);
      showMessage("Mint failed. Check console for details.", "error"); // Use showMessage
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      {/* WalletMultiButton is typically handled by WalletConnectionProvider higher up */}
      {/* <WalletMultiButton /> */}
      <button
        onClick={handleMint}
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
      >
        Mint NFT
      </button>
    </div>
  );
}
