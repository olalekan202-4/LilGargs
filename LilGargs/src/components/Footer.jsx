// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-6 text-center text-gray-400 shadow-inner mt-12">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} Lil Gargs NFT. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="https://twitter.com/YourTwitterHandle" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            Twitter
          </a>
          <a
            href="https://discord.gg/YourDiscordInvite" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors"
          >
            Discord
          </a>
          {/* Add more social links as needed */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
