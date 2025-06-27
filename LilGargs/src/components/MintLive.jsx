// src/components/MintLive.jsx
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import { getMintTransaction } from '../api';
import { motion } from 'framer-motion';

const MintLive = ({ livePhase, mintedCount, totalSupply, showMessage, refresh, connection }) => {
    const { publicKey, signTransaction } = useWallet();
    const [mintCount, setMintCount] = useState(1);
    const [isMinting, setIsMinting] = useState(false);

    const handleMint = async () => {
        if (!publicKey || !signTransaction) {
            showMessage("Please connect your wallet to mint.", "error");
            return;
        }

        setIsMinting(true);
        showMessage(`Preparing to mint ${mintCount} NFT(s) from the ${livePhase.name} phase...`, 'info');

        try {
            // Use the 'group' from the live phase object passed in props
            const { mintTx } = await getMintTransaction(publicKey.toBase58(), mintCount, livePhase.group);

            if (!mintTx) throw new Error("Did not receive a valid transaction from the server.");
            
            showMessage("Transaction received, please sign...", "info");

            const txBuffer = Buffer.from(mintTx, "base64");
            const versionedTx = VersionedTransaction.deserialize(txBuffer);
            const signedTx = await signTransaction(versionedTx);
            
            showMessage("Simulating transaction...", "info");

            const { value: simulationResult } = await connection.simulateTransaction(signedTx, { commitment: "confirmed" });
            if (simulationResult.err) {
                console.error("Simulation Error:", simulationResult.logs);
                throw new Error("Transaction simulation failed. Check console for details.");
            }

            showMessage("Sending transaction...", "info");
            const txid = await connection.sendRawTransaction(signedTx.serialize());
            await connection.confirmTransaction(txid, "confirmed");

            showMessage(`Mint successful! Transaction: ${txid.substring(0, 10)}...`, "success");
            
            if(refresh) refresh();

        } catch (error) {
            console.error("Minting failed:", error);
            showMessage(error.message || "An unknown error occurred during mint.", "error");
        } finally {
            setIsMinting(false);
        }
    };

    const progress = totalSupply > 0 ? (mintedCount / totalSupply) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700 h-full flex flex-col justify-center"
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
                    <span>{progress.toFixed(0)}% ({mintedCount} / {totalSupply})</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <div className="flex justify-between items-center my-6">
                <span className="font-bold text-lg">Price: {livePhase.price}</span>
                <div className="flex items-center gap-3">
                    <button onClick={() => setMintCount(p => Math.max(1, p - 1))} disabled={isMinting} className="px-4 py-2 bg-gray-700 rounded-lg text-xl font-bold hover:bg-gray-600 transition disabled:opacity-50">-</button>
                    <span className="text-3xl font-bold text-purple-400 w-12 text-center">{mintCount}</span>
                    <button onClick={() => setMintCount(p => p + 1)} disabled={isMinting} className="px-4 py-2 bg-gray-700 rounded-lg text-xl font-bold hover:bg-gray-600 transition disabled:opacity-50">+</button>
                </div>
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMint}
                disabled={isMinting}
                className="w-full py-4 bg-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-purple-700 transition transform focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {isMinting ? (
                    <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Minting...
                    </div>
                ) : "Mint"}
            </motion.button>
        </motion.div>
    );
};

export default MintLive;