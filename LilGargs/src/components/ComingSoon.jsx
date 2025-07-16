// src/components/ComingSoon.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
    { name: 'Claim $GARG', status: 'Coming Soon', teaser: 'Claim your mined $GARG tokens directly to your wallet. ETA: Q3 2025' },
    { name: 'Fusion Chamber', status: 'Coming Soon', teaser: 'The Fusion Chamber is where two Lil’ Gargs merge into something greater… Launching soon.' },
    { name: 'GargShop', status: 'Coming Soon', teaser: 'Spend your $GARG in the GargShop for exclusive boosts, items, and WL spots.' },
    { name: 'Trait Reveal', status: 'Coming Soon', teaser: 'Once minted, your OG\'s final traits will be revealed here.' },
    { name: '1/1 Raffles', status: 'Coming Soon', teaser: 'Enter raffles with your $GARG for a chance to win ultra-rare 1-of-1 Lil Gargs.' },
    { name: 'GARG/SOL Swap', status: 'Coming Soon', teaser: 'A dedicated, low-fee swap to trade your $GARG for SOL and back.' },
];

const TeaserModal = ({ content, onClose }) => (
    <AnimatePresence>
        {content && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, y: 50, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="bg-gray-800 border border-purple-500 p-8 rounded-2xl text-center max-w-md shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <p className="text-white text-lg">{content}</p>
                    <button onClick={onClose} className="mt-6 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">Close</button>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const ComingSoon = () => {
    const [modalContent, setModalContent] = useState(null);

    return (
        <>
            <TeaserModal content={modalContent} onClose={() => setModalContent(null)} />
            <section className="container md:mx-auto my-12">
                <h2 className="text-3xl font-bold text-center text-gray-400 mb-8">Future of the Gargiverse</h2>
                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {features.map(feature => (
                        <motion.div 
                            key={feature.name} 
                            onClick={() => setModalContent(feature.teaser)}
                            className="bg-gray-800/50 p-6 rounded-2xl text-center border border-gray-700 shadow-lg backdrop-blur-md cursor-pointer hover:border-purple-500 hover:shadow-purple-500/20 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <h3 className="text-sm md:text-xl font-bold text-white mb-2">{feature.name}</h3>
                            <p className="text-purple-400 text-sm md:text-base font-semibold">{feature.status}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </>
    );
};
export default ComingSoon;