// src/components/GargShop.jsx
import React from 'react';
import { motion } from 'framer-motion';

// An SVG icon for the lock to make it clean and scalable
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);


const GargShop = () => {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="container mx-auto p-6 my-24"
    >
      <div className="bg-gray-800/50 border border-cyan-500/30 rounded-3xl shadow-2xl backdrop-blur-md text-center p-12 max-w-4xl mx-auto">
        
        <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-6"
        >
            <LockIcon />
        </motion.div>
        
        <h2 className="text-xl md:text-4xl font-bold text-center text-cyan-300 mb-4 tracking-tight">
          The GargShop Awakens Soon
        </h2>
        
        <p className="text-sm md:text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          The forge is being prepared. Soon you will be able to spend your <span className="font-bold text-cyan-400">$GARG</span> on powerful boosts, legendary artifacts, and raffle tickets for one-of-a-kind treasures.
        </p>

        <div className="font-mono text-xl text-yellow-400 border border-yellow-400/50 bg-yellow-400/10 rounded-lg px-6 py-3 inline-block">
            Anticipate an Unveiling
        </div>

      </div>
    </motion.section>
  );
};

export default GargShop;