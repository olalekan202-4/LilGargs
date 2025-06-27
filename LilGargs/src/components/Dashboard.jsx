import { useState, useEffect } from 'react';

const MINING_RATE_PER_NFT = 0.0005775; // $GARG per second per OG NFT

const Dashboard = ({ ownedNfts, loading }) => {
    const [unclaimedGarg, setUnclaimedGarg] = useState(0.0);

    const ogCount = Array.isArray(ownedNfts) ? ownedNfts.length : 0;
    const totalMiningRate = ogCount * MINING_RATE_PER_NFT;

    useEffect(() => {
        // Start mining simulation if the user owns NFTs
        if (totalMiningRate > 0) {
            const interval = setInterval(() => {
                setUnclaimedGarg(prev => prev + totalMiningRate);
            }, 1000); // Update every second

            return () => clearInterval(interval);
        }
    }, [totalMiningRate]);

    if (loading) {
        return (
            <div className="text-center p-10 bg-gray-800/50 rounded-2xl mb-12">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-purple-500 mx-auto"></div>
                <p className="text-lg mt-4 text-gray-300">Loading Your Dashboard...</p>
            </div>
        );
    }
    
    // Don't show the dashboard if the user has no OGs
    if (ogCount === 0) {
        return null;
    }

    return (
        <section className="container mx-auto p-6 my-12 bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700">
            <h2 className="text-3xl font-bold text-center text-purple-300 mb-6">Your Mining Dashboard</h2>
            <div className="flex flex-col md:flex-row justify-around items-center gap-8">
                {/* Mining Rate */}
                <div className="text-center">
                    <p className="text-lg text-gray-400 mb-1">Live Mining Rate</p>
                    <p className="text-2xl font-bold text-white">
                        {ogCount} OG{ogCount > 1 ? 's' : ''} &times; {MINING_RATE_PER_NFT} = <span className="text-purple-400">{totalMiningRate.toFixed(8)} $GARG/sec</span>
                    </p>
                </div>

                {/* Unclaimed GARG */}
                <div className="text-center bg-gray-900/50 p-6 rounded-xl border border-purple-500 shadow-lg">
                    <p className="text-xl text-gray-300 mb-2">Unclaimed $GARG</p>
                    <p className="text-5xl font-mono font-bold text-emerald-400 tracking-wider">
                        {unclaimedGarg.toFixed(6)}
                    </p>
                </div>

                {/* Claim Button */}
                <div className="text-center">
                     <button 
                        disabled 
                        className="px-8 py-4 bg-gray-600 text-white font-bold rounded-xl shadow-md cursor-not-allowed flex flex-col items-center"
                    >
                        <span>Claim $GARG</span>
                        <span className="text-xs font-normal mt-1">(Unlocks at full launch)</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;