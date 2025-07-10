// src/components/MintLive.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import { getMintTransaction } from "../api";

function useAnimatedCounter(toValue) {
  const nodeRef = useRef(null);
  const fromValue = useRef(0);
  useEffect(() => {
    const node = nodeRef.current;
    const controls = animate(fromValue.current, toValue, {
      duration: 0.5,
      ease: "easeOut",
      onUpdate(value) {
        if (node) node.textContent = value.toFixed(2);
      },
    });
    fromValue.current = toValue;
    return () => controls.stop();
  }, [toValue]);
  return <span ref={nodeRef} />;
}

const MintLive = ({
  livePhase,
  mintedCount,
  totalSupply,
  showMessage,
  refresh,
  connection,
}) => {
  // UPDATED: Get the high-level sendTransaction function from the useWallet hook
  const { publicKey, sendTransaction } = useWallet();
  const [mintCount, setMintCount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async () => {
    // UPDATED: Check for the new function
    if (!publicKey || !sendTransaction) {
      showMessage("Please connect your wallet to mint.", "error");
      return;
    }

    setIsMinting(true);
    showMessage(`Preparing to mint ${mintCount} NFT(s)...`, "info");
    try {
      const { mintTx } = await getMintTransaction(
        publicKey.toBase58(),
        mintCount,
        livePhase.group
      );
      if (!mintTx) throw new Error("Did not receive a valid transaction.");
      
      showMessage("Transaction received, please sign...", "info");
      const txBuffer = Buffer.from(mintTx, "base64");
      const versionedTx = VersionedTransaction.deserialize(txBuffer);

      // UPDATED: Use the robust `sendTransaction` method from the wallet adapter
      // It handles signing and sending in one secure step. It requires the 'connection' object.
      const signature = await sendTransaction(versionedTx, connection);
      
      showMessage("Confirming transaction...", "info");
      await connection.confirmTransaction(signature, "confirmed");

      showMessage(
        `Mint successful! Transaction: ${signature.substring(0, 10)}...`,
        "success"
      );

      if (refresh) refresh();

    } catch (error) {
      console.error("Minting failed:", error);
       if (error.name === 'WalletSendTransactionError' || error.message.includes('User rejected the request')) {
          showMessage("Transaction rejected.", "error");
      } else {
          showMessage(error.message || "An unknown error occurred.", "error");
      }
    } finally {
      setIsMinting(false);
    }
  };

  const progress = totalSupply > 0 ? (mintedCount / totalSupply) * 100 : 0;
  const pricePerNFT = parseFloat(livePhase.price);
  const totalCost = mintCount * pricePerNFT;
  const animatedTotalCost = useAnimatedCounter(totalCost);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700 h-full flex flex-col justify-center shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-green-400 font-bold flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          LIVE
        </span>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1 text-gray-300">
          <span>Supply: {totalSupply}</span>
          <span>
            {progress.toFixed(0)}% ({mintedCount} / {totalSupply})
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-purple-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="flex justify-between items-center my-6">
        <span className="font-bold text-lg">Price: {livePhase.price}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMintCount((p) => Math.max(1, p - 1))}
            disabled={isMinting}
            className="px-4 py-2 bg-gray-700 rounded-lg text-xl font-bold hover:bg-gray-600 transition disabled:opacity-50"
          >
            -
          </button>
          <span className="text-3xl font-bold text-purple-400 w-12 text-center">
            {mintCount}
          </span>
          <button
            onClick={() => setMintCount((p) => p + 1)}
            disabled={isMinting}
            className="px-4 py-2 bg-gray-700 rounded-lg text-xl font-bold hover:bg-gray-600 transition disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>
      <div className="text-center text-sm text-gray-400 -mt-4 mb-6">
        Total:{" "}
        <span className="font-bold text-white">{animatedTotalCost} SOL</span>{" "}
        <span className="text-gray-500">(+ fee)</span>
      </div>
      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 0px 20px rgba(168, 85, 247, 0.7)",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={handleMint}
        disabled={isMinting}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
      >
        {isMinting ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2"></div>
            Minting...
          </div>
        ) : (
          "Mint"
        )}
      </motion.button>
    </motion.div>
  );
};

export default MintLive;