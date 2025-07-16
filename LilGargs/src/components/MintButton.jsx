// src/components/MintButton.jsx
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, VersionedTransaction } from '@solana/web3.js';
import { getMintTransaction } from '../api';
import { motion } from 'framer-motion';

const MintButton = ({ showMessage, refresh, launchpadInfo }) => {
    const { publicKey, signTransaction } = useWallet();
    const [mintCount, setMintCount] = useState(1);
    const [isMinting, setIsMinting] = useState(false);
    // You must replace this with your own Helius RPC API Key
    const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=735ac8d3-af29-4a2b-ad8b-6ed013fe2a04"); 

    const handleMint = async () => {
        if (!publicKey || !signTransaction) {
            showMessage("Please connect your wallet to mint.", "error");
            return;
        }

        setIsMinting(true);
        showMessage(`Preparing to mint ${mintCount} NFT(s)...`, 'info');

        try {
            const activePhase = "pb"; // Assuming public phase for this example
            const { mintTx } = await getMintTransaction(publicKey.toBase58(), mintCount, activePhase);

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

    const isMintDisabled = isMinting || !launchpadInfo || !launchpadInfo.publicPhaseStart;
    const mintButtonText = !launchpadInfo?.publicPhaseStart ? "Mint Not Started" : "Mint Now";

    return (
        <div className="flex flex-col items-center gap-6 p-8 bg-gray-800/50 rounded-2xl shadow-xl border border-gray-700 h-full">
            <h3 className="text-2xl font-bold text-white">Mint Your LilGargs OGs</h3>
            <div className="flex items-center gap-4">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMintCount(p => Math.max(1, p - 1))} disabled={isMinting} className="px-5 py-2 bg-gray-700 rounded-lg text-2xl font-bold hover:bg-gray-600 transition disabled:opacity-50">-</motion.button>
                <span className="text-4xl font-bold text-purple-400 w-16 text-center">{mintCount}</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMintCount(p => p + 1)} disabled={isMinting} className="px-5 py-2 bg-gray-700 rounded-lg text-2xl font-bold hover:bg-gray-600 transition disabled:opacity-50">+</motion.button>
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMint}
                disabled={isMintDisabled}
                className="w-full max-w-xs px-8 py-4 bg-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-purple-700 transition transform focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
            >
                {isMinting ? (
                    <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Minting...
                    </div>
                ) : mintButtonText}
            </motion.button>
        </div>
    );
};

export default MintButton;
