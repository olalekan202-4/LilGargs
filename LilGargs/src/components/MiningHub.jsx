// src/components/MiningHub.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

const DAILY_CLAIM_AMOUNT = 10;

// This component now receives its state as props from App.jsx
const MiningHub = ({ ownedNfts, unclaimedGarg, totalMiningRate, onDailyClaim }) => {
    const [canClaim, setCanClaim] = useState(false);

    const ogCount = Array.isArray(ownedNfts) ? ownedNfts.length : 0;

    // Effect to check if daily claim is available
    useEffect(() => {
        const lastClaimTime = localStorage.getItem('lastGargClaim');
        if (lastClaimTime) {
            const timeDiff = Date.now() - parseInt(lastClaimTime, 10);
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            setCanClaim(hoursDiff >= 24);
        } else {
            setCanClaim(true); // Can claim if never claimed before
        }
    }, []);

    const handleDailyClaim = () => {
        if (canClaim) {
            onDailyClaim(DAILY_CLAIM_AMOUNT); // Pass the claim amount to the parent
            const now = Date.now();
            localStorage.setItem('lastGargClaim', now.toString());
            setCanClaim(false);
            alert(`You claimed your daily bonus of ${DAILY_CLAIM_AMOUNT} $GARG!`);
        }
    };

    if (ogCount === 0) {
        return (
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center p-8 bg-gray-800/50 rounded-2xl border border-gray-700 h-full flex flex-col justify-center"
            >
                <h3 className="text-2xl font-bold text-white">The Gargoyle Mines Await</h3>
                <p className="text-gray-400 mt-2">Your Mining Hub will activate here once you mint or own a Lil Garg OG.</p>
            </motion.div>
        )
    }

    return (
        <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 my-12 bg-gray-900/50 rounded-3xl shadow-2xl backdrop-blur-xl border border-purple-500/30 relative overflow-hidden h-full"
        >
             {/* Animated glowing border effect */}
            <motion.div
                animate={{
                    borderColor: ["rgba(168, 85, 247, 0.3)", "rgba(139, 92, 246, 0.7)", "rgba(168, 85, 247, 0.3)"],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 border-2 rounded-3xl pointer-events-none"
            />
            
            <h2 className="text-3xl font-bold text-center text-purple-300 mb-6">Gargoyle Mining Hub</h2>
            <div className="flex flex-col justify-around items-center gap-8 z-10 relative h-full">
                {/* Unclaimed GARG */}
                <div className="text-center bg-gray-900/50 p-6 rounded-xl border border-purple-500/50 shadow-lg w-full">
                    <p className="text-xl text-gray-300 mb-2">Unclaimed $GARG</p>
                    <p className="text-5xl font-mono font-bold text-emerald-400 tracking-wider">
                        <AnimatedCounter from={unclaimedGarg - totalMiningRate} to={unclaimedGarg} />
                    </p>
                    <p className="text-sm text-purple-400 mt-2">
                        Mining at {totalMiningRate.toFixed(8)} $GARG/sec
                    </p>
                </div>

                {/* Daily Claim */}
                <div className="text-center w-full">
                     <button 
                        onClick={handleDailyClaim}
                        disabled={!canClaim}
                        className="w-full px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-500 transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-50"
                    >
                        <span>{canClaim ? `Claim Daily ${DAILY_CLAIM_AMOUNT} $GARG` : 'Daily Claim Collected'}</span>
                        {!canClaim && <span className="text-xs font-normal mt-1 block">(Come back in 24 hours)</span>}
                    </button>
                </div>
            </div>
        </motion.section>
    );
};

export default MiningHub;
