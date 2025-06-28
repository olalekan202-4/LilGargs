// src/components/GargShop.jsx
import React from "react";
import { motion } from "framer-motion";

const shopItems = [
  {
    id: "boost",
    name: "+5% mining boost for 24hours",
    description: "Double your $GARG mining rate for 24 hours.",
    price: 50,
    emoji: "🚀",
  },
  {
    id: "flair",
    name: "Fusion Token",
    description:
      "Needed for NFT fusion (future utility)",
    price: 300,
    emoji: "💥",
  },
  {
    id: "raffle",
    name: "Mystery Garg Box",
    description:
      "Random chance for cosmetic or small mining boost",
    price: 100,
    emoji: "📦",
  },
];

const GargShop = ({ userGargBalance, onPurchase, activeBoost }) => {
  return (
    <section className="container mx-auto p-6 my-12">
      <h2 className="text-3xl font-bold text-center text-cyan-300 mb-8">
        GargShop
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {shopItems.map((item) => {
          const canAfford = userGargBalance >= item.price;
          const isBoostActiveAndIsBoostItem =
            activeBoost && item.id === "boost";

          return (
            <motion.div
              key={item.id}
              className="bg-gray-800/50 p-6 rounded-2xl text-center border border-gray-700 shadow-lg backdrop-blur-md flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-5xl mb-4">{item.emoji}</div>
              <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
              <p className="text-gray-400 text-sm flex-grow">
                {item.description}
              </p>
              <p className="text-2xl font-bold text-cyan-400 my-4">
                {item.price} $GARG
              </p>
              <motion.button
                onClick={() => onPurchase(item.id, item.price)}
                disabled={!canAfford || isBoostActiveAndIsBoostItem}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-auto w-full px-6 py-3 bg-cyan-600 text-white font-bold rounded-xl shadow-lg hover:bg-cyan-500 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isBoostActiveAndIsBoostItem
                  ? "Boost Active"
                  : canAfford
                  ? "Buy Now"
                  : "Not Enough $GARG"}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default GargShop;
