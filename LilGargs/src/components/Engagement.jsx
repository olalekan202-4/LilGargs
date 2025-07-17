// src/components/Engagement.jsx
import React from "react";
import { motion } from "framer-motion";

// Receive totalMiningRate as a new prop
const Engagement = ({ unclaimedGarg, ogCount, totalMiningRate }) => {
  const handleShare = () => {
    const siteUrl = "lilgarg.xyz";

    // Updated tweet text to include the mining rate
    const tweetText = `I'm mining $GARG at a rate of ${totalMiningRate.toFixed(
      6
    )}/sec with my ${ogCount} Lil’ Gargs OG(s) and have already earned ${unclaimedGarg.toFixed(
      4
    )} $GARG! 💎 Join the cosmic rebellion 👉 ${siteUrl} @lilgargs88`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="container mx-auto p-6 my-12 text-center"
    >
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        Join the Rebellion
      </h2>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {/* This button is only shown if the user owns at least one OG NFT */}
        {ogCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="px-8 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-colors"
          >
            Share Mining Progress
          </motion.button>
        )}
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="https://discord.gg/5mdVj5t8qk"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 bg-purple-700 text-white font-bold rounded-xl shadow-lg hover:bg-purple-800 transition-colors"
        >
          Join Our Discord
        </motion.a>
      </div>
    </motion.section>
  );
};

export default Engagement;
