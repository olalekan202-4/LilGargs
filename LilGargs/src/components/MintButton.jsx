// src/components/MintButton.jsx
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, VersionedTransaction } from '@solana/web3.js';
import { getMintTransaction } from '../api';

const MintButton = ({ showMessage, refresh, launchpadInfo }) => {
    const { publicKey, signTransaction } = useWallet();
    const [mintCount, setMintCount] = useState(1);
    const [isMinting, setIsMinting] = useState(false);
    const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY_HERE"); // Replace with your RPC

    const handleMint = async () => {
        if (!publicKey || !signTransaction) {
            showMessage("Please connect your wallet to mint.", "error");
            return;
        }

        setIsMinting(true);
        showMessage(`Preparing to mint ${mintCount} NFT(s)...`, 'info');

        try {
            // Determine mint phase - for simplicity, using public 'pb'
            const activePhase = "pb";

            // 1. Get transaction from Gensuki API
            const { mintTx } = await getMintTransaction(publicKey.toBase58(), mintCount, activePhase);

            if (!mintTx) {
                throw new Error("Did not receive a valid transaction from the server.");
            }
            showMessage("Transaction received, please sign...", "info");

            // 2. Deserialize and sign the transaction
            const txBuffer = Buffer.from(mintTx, "base64");
            const versionedTx = VersionedTransaction.deserialize(txBuffer);
            const signedTx = await signTransaction(versionedTx);
            
            showMessage("Simulating transaction...", "info");

            // 3. Simulate the transaction
            const simulationResult = await connection.simulateTransaction(signedTx, { commitment: "confirmed" });

            if (simulationResult.value.err) {
                console.error("Simulation Error:", simulationResult.value.logs);
                throw new Error("Transaction simulation failed. Check console for details.");
            }

            // 4. Send the transaction
            showMessage("Sending transaction...", "info");
            const txid = await connection.sendRawTransaction(signedTx.serialize());
            
            // 5. Confirm the transaction
            await connection.confirmTransaction(txid, "confirmed");

            showMessage(`Mint successful! Transaction: ${txid.substring(0, 10)}...`, "success");
            
            // Refresh NFT galleries
            if(refresh) refresh();

        } catch (error) {
            console.error("Minting failed:", error);
            showMessage(error.message || "An unknown error occurred during mint.", "error");
        } finally {
            setIsMinting(false);
        }
    };

    const increaseCount = () => setMintCount(prev => prev + 1);
    const decreaseCount = () => setMintCount(prev => Math.max(1, prev - 1));

    // Disable minting if no launchpad info is available (e.g. mint hasn't started)
    const isMintDisabled = isMinting || !launchpadInfo || !launchpadInfo.publicPhaseStart;
    const mintButtonText = !launchpadInfo?.publicPhaseStart ? "Mint Not Started" : "Mint Now";

    return (
        <div className="flex flex-col items-center gap-6 p-8 bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white">Mint Your LilGargs OGs</h3>
            <div className="flex items-center gap-4">
                <button onClick={decreaseCount} disabled={isMinting} className="px-4 py-2 bg-gray-700 rounded-lg text-2xl font-bold hover:bg-gray-600 transition disabled:opacity-50">-</button>
                <span className="text-3xl font-bold text-purple-400 w-16 text-center">{mintCount}</span>
                <button onClick={increaseCount} disabled={isMinting} className="px-4 py-2 bg-gray-700 rounded-lg text-2xl font-bold hover:bg-gray-600 transition disabled:opacity-50">+</button>
            </div>
            <button
                onClick={handleMint}
                disabled={isMintDisabled}
                className="w-full max-w-xs px-8 py-4 bg-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-purple-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
            >
                {isMinting ? (
                    <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Minting...
                    </div>
                ) : mintButtonText}
            </button>
        </div>
    );
};

export default MintButton;