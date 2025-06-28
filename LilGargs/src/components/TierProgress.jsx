// src/components/TierProgress.jsx
import React from "react";
import { motion } from "framer-motion";

const TierProgress = ({ ownedNfts }) => {
  const ogCount = Array.isArray(ownedNfts) ? ownedNfts.length : 0;

  // Define tiers - this can be expanded later
  const tiers = [
    { name: "Gargle Initiate", minOgs: 0 },
    { name: "Cosmic Miner", minOgs: 5 },
    { name: "OG Warlord", minOgs: 10 },
    { name: "Gargantuan Overlord", minOgs: 25 },
  ];

  const currentTierIndex = tiers
    .slice()
    .reverse()
    .findIndex((tier) => ogCount >= tier.minOgs);
  const currentTier = tiers[tiers.length - 1 - currentTierIndex];
  const nextTier = tiers[tiers.length - currentTierIndex];

  const progressToNextTier = nextTier
    ? ((ogCount - currentTier.minOgs) /
        (nextTier.minOgs - currentTier.minOgs)) *
      100
    : 100;

  if (ogCount === 0) return null; // Don't show for non-holders

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="container mx-auto p-6 my-12 bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700"
    >
      <h2 className="text-3xl font-bold text-center text-cyan-300 mb-6">
        Miner Tier
      </h2>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-2 text-white">
          <span className="font-bold text-lg">{currentTier.name}</span>
          {nextTier && (
            <span className="text-sm text-gray-400">
              Next Tier: {nextTier.name} at {nextTier.minOgs} OGs
            </span>
          )}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden border border-gray-600">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-cyan-400 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressToNextTier}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>
        <p className="text-center text-xs text-gray-500 mt-3">
          Higher tiers unlock future boosts, bonuses, and bragging rights in the
          Gargiverse.
        </p>
      </div>
    </motion.section>
  );
};

export default TierProgress;
