import React from 'react';

// Placeholder data for the leaderboard
const topMiners = [
    { rank: 1, wallet: 'GargLord.sol', ogs: 52, mined: '1,203.45 $GARG' },
    { rank: 2, wallet: '8f...k9s', ogs: 45, mined: '987.12 $GARG' },
    { rank: 3, wallet: 'CosmicRebel.sol', ogs: 38, mined: '854.78 $GARG' },
    { rank: 4, wallet: 'zK...L2e', ogs: 35, mined: '812.99 $GARG' },
    { rank: 5, wallet: 'Gargantuan.eth', ogs: 31, mined: '745.01 $GARG' },
];

const GlobalStats = () => (
    <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-cyan-300">
            🌐 Total $GARG Mined: <span className="font-mono">1,234,567.890</span>
        </h3>
        <p className="text-sm text-gray-500">(Live data coming soon)</p>
    </div>
);


const Leaderboard = () => {
    return (
         <section className="container mx-auto p-6 my-12 bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700">
            <h2 className="text-3xl font-bold text-center text-emerald-300 mb-6">Top Miners Leaderboard</h2>
            <GlobalStats />
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-3">Rank</th>
                            <th className="p-3">Wallet</th>
                            <th className="p-3 text-center">OGs Owned</th>
                            <th className="p-3 text-right">$GARG Mined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topMiners.map(miner => (
                            <tr key={miner.rank} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-3 font-bold text-lg">{miner.rank}</td>
                                <td className="p-3 font-mono">{miner.wallet}</td>
                                <td className="p-3 text-center font-bold text-purple-400">{miner.ogs}</td>
                                <td className="p-3 text-right font-mono text-emerald-400">{miner.mined}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4">Leaderboard updates every 60 seconds. User highlighting coming soon.</p>
        </section>
    );
};

export default Leaderboard;