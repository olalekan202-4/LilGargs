// src/components/Leaderboard.jsx
import React from "react";
import { motion } from "framer-motion";

// Placeholder data for the leaderboard
const topMiners = [
  { rank: 1, wallet: "GargLord.sol", ogs: 52, mined: "1,203.45 $GARG" },
  { rank: 2, wallet: "8f...k9s", ogs: 45, mined: "987.12 $GARG" },
  { rank: 3, wallet: "CosmicRebel.sol", ogs: 38, mined: "854.78 $GARG" },
  { rank: 4, wallet: "zK...L2e", ogs: 35, mined: "812.99 $GARG" },
  { rank: 5, wallet: "Gargantuan.eth", ogs: 31, mined: "745.01 $GARG" },
  {
    rank: 5,
    wallet: "4fNqdQRDnKEpVvxvozNftiS67AHM2wLvKLNvaHkeuAWB",
    ogs: 25,
    mined: "650.00 $GARG",
  }, // Example for highlighting
];

const GlobalStats = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="text-center mb-8"
  >
    <h3 className="text-2xl font-bold text-cyan-300">
      🌐 Total $GARG Mined: <span className="font-mono">1,234,567.890</span>
    </h3>
    <p className="text-sm text-gray-500">(Live data coming soon)</p>
  </motion.div>
);

const Leaderboard = ({ userWalletAddress }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="container mx-auto p-6 my-12 bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700"
    >
      <h2 className="text-3xl font-bold text-center text-emerald-300 mb-6">
        Top Miners Leaderboard
      </h2>
      <GlobalStats />
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-3">Rank</th>
              <th className="p-3">Wallet</th>
              <th className="p-3 text-center">OGs Owned</th>
              <th className="p-3 text-right">$GARG Mined</th>
            </tr>
          </thead>
          <tbody>
            {topMiners.map((miner, index) => {
              const isUser = miner.wallet === userWalletAddress;

              return (
                <motion.tr
                  layout
                  key={miner.rank}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={`border-b border-gray-700 transition-colors duration-300 ${
                    isUser
                      ? "bg-purple-900/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                      : "hover:bg-gray-700/50"
                  }`}
                >
                  <td className="p-3 font-bold text-lg">{miner.rank}</td>
                  <td className="p-3 font-mono flex items-center gap-2">
                    {miner.wallet}
                    {isUser && (
                      <span className="text-xs font-bold bg-purple-600 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center font-bold text-purple-400">
                    {miner.ogs}
                  </td>
                  <td className="p-3 text-right font-mono text-emerald-400">
                    {miner.mined}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-center text-xs text-gray-500 mt-4">
        Leaderboard updates every 60 seconds. User highlighting coming soon.
      </p>
    </motion.section>
  );
};

export default Leaderboard;
