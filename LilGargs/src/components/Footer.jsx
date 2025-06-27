// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
    const funFact = "Did you know OGs will unlock fusion first?";

    return (
        <footer className="bg-gray-900/50 border-t border-gray-700/50 mt-16">
            <div className="container mx-auto py-8 px-4 text-center text-gray-400">
                <div className="mb-4">
                    <h3 className="font-bold text-purple-300">A Cosmic Fragment of Lore</h3>
                    <p className="max-w-3xl mx-auto text-sm mt-2">
                        Lil’ Gargs are ancient cosmic fragments reborn into digital guardians. OGs are the elite — they mine $GARG at 1.5× speed and unlock the future of the Gargiverse.
                    </p>
                </div>
                 <div className="my-6">
                    <h4 className="font-bold text-cyan-300">Daily Fun Fact</h4>
                    <p className="text-sm mt-1">"{funFact}"</p>
                </div>
                <p className="text-xs">&copy; {new Date().getFullYear()} Lil Gargs. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
