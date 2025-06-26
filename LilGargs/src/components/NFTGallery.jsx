// src/components/NFTGallery.jsx
import React from 'react';

const NFTCard = ({ nft }) => {
    // Sanitize image URL
    const imageUrl = nft.image || nft.imageUrl || "https://placehold.co/300x300/312e81/ffffff?text=No+Image";

    return (
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300 group">
            <div className="w-full h-64 overflow-hidden">
                 <img
                    src={imageUrl}
                    alt={nft.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300/312e81/ffffff?text=NFT'; }}
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-white truncate">{nft.name}</h3>
                {nft.description && <p className="text-sm text-gray-400 mt-1 h-10 overflow-hidden">{nft.description}</p>}
            </div>
        </div>
    );
};


const NFTGallery = ({ nfts, loading, error }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="bg-gray-800 rounded-xl h-80 animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-10 bg-red-900/20 rounded-lg"><p className="text-xl text-red-400">{error}</p></div>;
    }

    if (!nfts || nfts.length === 0) {
        return <div className="text-center p-10 bg-gray-800/50 rounded-lg"><p className="text-xl text-gray-400">No NFTs found.</p></div>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {nfts.map((nft, index) => (
                <NFTCard key={nft.mintAddress || nft.publicKey || index} nft={nft} />
            ))}
        </div>
    );
};

export default NFTGallery;
