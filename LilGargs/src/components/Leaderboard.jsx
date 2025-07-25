// src/components/Leaderboard.jsx
import { useState, useEffect, useMemo, useRef } from "react"; // Added useRef
import { motion } from "framer-motion";
import { getLeaderboardData } from "../api";

const MINING_RATE_PER_NFT = 0.0005775;

const GlobalStats = ({ totalMined }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="text-center mb-8"
  >
    <h3 className="text-2xl font-bold text-cyan-300">
      🌐 Total $GARG Mined:
      <span className="font-mono ml-2">
        {totalMined.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })}
      </span>
    </h3>
    <p className="text-sm text-gray-500">
      (Live global stats from leaderboard)
    </p>
  </motion.div>
);

const Leaderboard = ({ userWalletAddress, purchasedFlairs = {} }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use a ref to track if it's the very first load
  const isInitialLoad = useRef(true); // Added

  // ---Logic to fetch data periodically ---
  useEffect(() => {
    const fetchData = () => {
      // Only set loading to true for the *initial* fetch
      if (isInitialLoad.current) { // Modified
        setIsLoading(true); // Modified
      }
      getLeaderboardData()
        .then((data) => {
          setLeaderboardData(data);
          setError(null);
        })
        .catch((err) => {
          console.error("Failed to load leaderboard:", err);
          setError("Could not load leaderboard data.");
        })
        .finally(() => {
          // Always set loading to false after a fetch completes
          setIsLoading(false); // Modified
          isInitialLoad.current = false; // Mark initial load as complete
        });
    };

    // Fetch data immediately when the component mounts or userWalletAddress changes
    fetchData();

    // Set up an interval to refetch the data every 6 seconds (0.1 * 60 * 1000 milliseconds)
    const intervalId = setInterval(fetchData, 0.1 * 60 * 1000);

    // Cleanup function
    return () => clearInterval(intervalId);
  }, [userWalletAddress]); // Keep userWalletAddress as dependency

  const totalMined = useMemo(() => {
    if (!leaderboardData) return 0;
    return leaderboardData.reduce((sum, miner) => sum + miner.miningBalance, 0);
  }, [leaderboardData]);

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
      <GlobalStats totalMined={totalMined} />
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
            {isLoading && leaderboardData.length === 0 ? ( // Modified condition
              <tr>
                <td colSpan="4" className="text-center p-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center p-8 text-red-400">
                  {error}
                </td>
              </tr>
            ) : (
              leaderboardData.map((miner, index) => {
                const isUser = miner.walletAddress === userWalletAddress;
                const hasFlair = purchasedFlairs[miner.walletAddress];
                const displayAddress = `${miner.walletAddress.substring(
                  0,
                  4
                )}...${miner.walletAddress.length > 8 ? miner.walletAddress.substring(
                  miner.walletAddress.length - 4
                ) : ''}`;
                const ogsOwned = Math.round(
                  miner.miningRate / MINING_RATE_PER_NFT
                );

                return (
                  <motion.tr
                    layout
                    key={miner.walletAddress}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 * index }}
                    className={`border-b border-gray-700 transition-colors duration-300 ${
                      isUser
                        ? "bg-purple-900/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        : "hover:bg-gray-700/50"
                    }`}
                  >
                    <td className="p-3 font-bold text-lg">{miner.rank}</td>
                    <td className="p-3 font-mono flex items-center gap-2">
                      {hasFlair && <span title="Leaderboard Flair">⭐</span>}
                      {displayAddress}
                      {isUser && (
                        <span className="text-xs font-bold bg-purple-600 px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center font-bold text-purple-400">
                      {ogsOwned}
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-400">
                      {miner.miningBalance.toFixed(6)}
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
};

export default Leaderboard;