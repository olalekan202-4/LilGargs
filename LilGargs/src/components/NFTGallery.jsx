// src/components/NFTGallery.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NFTDetailModal = ({ nft, onClose, onPurchase }) => {
    if (!nft) return null;

    const imageUrl = nft.image || nft.imageUrl || "https://placehold.co/500x500/312e81/ffffff?text=No+Image";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row p-4 mx-4">
                <div className="w-full md:w-1/2 p-4">
                    <img src={imageUrl} alt={nft.name || 'NFT Image'} className="w-full h-auto object-contain rounded-lg shadow-lg" />
                </div>
                <div className="w-full md:w-1/2 p-4 flex flex-col overflow-y-auto">
                    <h2 className="text-3xl font-bold text-white mb-4">{nft.name || 'Unnamed NFT'}</h2>
                    <p className="text-gray-300 mb-6">{nft.description || "No description available."}</p>
                    
                    <h3 className="text-xl font-semibold text-purple-400 mb-2">Attributes</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                        {nft.attributes?.map((attr, index) => (
                            <div key={index} className="bg-gray-700/50 p-3 rounded-lg text-center">
                                <p className="text-xs text-purple-300 uppercase">{attr.trait_type}</p>
                                <p className="text-sm font-semibold text-white truncate">{attr.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-4">
                        <button onClick={onClose} className="w-full px-6 py-3 bg-gray-600 text-white font-bold rounded-xl hover:bg-gray-500 transition">
                            Close
                        </button>
                        <button 
                            onClick={() => onPurchase(nft)} 
                            className="w-full px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-500 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                            disabled // This will be enabled once purchase logic is implemented
                        >
                            Purchase
                        </button>
                    </div>
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl hover:text-gray-400">&times;</button>
            </div>
        </div>
    );
};


const NFTCard = ({ nft, onSelect }) => {
    const imageUrl = nft.image || nft.imageUrl || "https://placehold.co/300x300/312e81/ffffff?text=No+Image";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300 group"
        >
            <div className="w-full h-64 overflow-hidden">
                 <img
                    src={imageUrl}
                    alt={nft.name || 'NFT Image'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300/312e81/ffffff?text=NFT'; }}
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-white truncate">{nft.name || 'Unnamed NFT'}</h3>
                {nft.description && <p className="text-sm text-gray-400 mt-1 h-10 overflow-hidden">{nft.description}</p>}
                <button 
                    onClick={() => onSelect(nft)} 
                    className="w-full mt-4 px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition"
                >
                    Inspect
                </button>
            </div>
        </motion.div>
    );
};


const NFTGallery = ({ nfts, loading, error, title }) => { // Added 'title' prop here
    const [selectedNft, setSelectedNft] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; 

    useEffect(() => {
        setCurrentPage(1);
    }, [nfts]);

    const handlePurchase = (nft) => {
        console.log("Attempting to purchase:", nft);
        alert(`Purchase functionality for "${nft.name}" is not yet implemented.`);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(pageSize)].map((_, i) => (
                    <div key={i} className="bg-gray-800 rounded-xl h-96 animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-10 bg-red-900/20 rounded-lg"><p className="text-xl text-red-400">{error.toString()}</p></div>;
    }

    if (!Array.isArray(nfts) || nfts.length === 0) {
        // Only show "No NFTs found" if a title is present, otherwise render nothing
        return title ? <div className="text-center p-10 bg-gray-800/50 rounded-lg"><p className="text-xl text-gray-400">No NFTs found.</p></div> : null;
    }
    
    const pageCount = Math.ceil(nfts.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedNfts = nfts.slice(startIndex, startIndex + pageSize);

    const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, pageCount));
    const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

    return (
        <section className="my-16">
            {/* THIS IS THE NEW HEADING */}
            {title && <h2 className="text-3xl font-bold text-center text-white mb-8">{title}</h2>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {paginatedNfts.map((nft, index) => (
                    <NFTCard key={nft.mintAddress || nft.publicKey || index} nft={nft} onSelect={setSelectedNft} />
                ))}
            </div>

            {pageCount > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button 
                        onClick={goToPreviousPage} 
                        disabled={currentPage === 1}
                        className="px-6 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-white font-semibold">
                        Page {currentPage} of {pageCount}
                    </span>
                    <button 
                        onClick={goToNextPage} 
                        disabled={currentPage === pageCount}
                        className="px-6 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}

            <NFTDetailModal 
                nft={selectedNft} 
                onClose={() => setSelectedNft(null)}
                onPurchase={handlePurchase}
            />
        </section>
    );
};

export default NFTGallery;