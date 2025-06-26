// src/components/MintDetails.jsx
import React from 'react';

const MintDetails = ({ launchpadInfo, collectionNfts, loading, error }) => {
    // Show a loading state while data is being fetched.
    if (loading) {
        return (
            <div className="text-center p-10">
                <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-500 mx-auto"></div>
                <p className="text-lg mt-4 text-gray-300">Loading Mint Details...</p>
            </div>
        );
    }

    // Show an error message if the API call failed.
    if (error) {
        return (
            <div className="text-center p-10 bg-red-900/20 rounded-lg">
                <p className="text-xl text-red-400">Could not load launchpad details.</p>
                {/* The error message from the API is now displayed */}
                <p className="text-sm text-gray-400 mt-2">{error.toString()}</p>
            </div>
        );
    }

    // Show a message if no launchpad info is available yet.
    if (!launchpadInfo) {
        return (
            <div className="text-center p-10 bg-gray-800/50 rounded-lg">
                 <p className="text-xl text-gray-400">Launchpad information is not available yet.</p>
            </div>
        );
    }

    // Destructure the properties from launchpadInfo once we know it exists.
    const {
        projectName,
        projectImageUrl,
        projectDescription,
        supply,
        publicPhaseStart,
    } = launchpadInfo;

    // Calculate the number of available NFTs
    const mintedCount = collectionNfts?.length || 0;
    const availableSupply = supply ? supply - mintedCount : 0;

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        const date = new Date(dateString);
        return date.toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    return (
        <section className="container mx-auto p-4 sm:p-6 lg:p-8 my-12 bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1 flex justify-center">
                    <img
                        src={projectImageUrl}
                        // Use projectName in the alt tag for better accessibility.
                        alt={`${projectName || 'Project'} cover`}
                        className="w-64 h-64 rounded-xl object-cover shadow-lg border-2 border-purple-500"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300/312e81/ffffff?text=Image'; }}
                    />
                </div>
                <div className="md:col-span-2 text-center md:text-left">
                    {/* Display project name, fallback to a default if not available. */}
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">{projectName || 'NFT Project'}</h1>
                    <p className="text-gray-300 text-lg mb-6">{projectDescription || 'No description available.'}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-lg mb-6">
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <span className="font-bold text-cyan-400">Available:</span>
                            <span className="ml-2 text-white">{supply ? `${availableSupply} / ${supply}` : 'N/A'}</span>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <span className="font-bold text-purple-400">Total Supply:</span>
                            <span className="ml-2 text-white">{supply ? `${supply} NFTs` : 'N/A'}</span>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <span className="font-bold text-emerald-400">Public Mint:</span>
                            <span className="ml-2 text-white">{formatDate(publicPhaseStart)}</span>
                        </div>
                    </div>
                    {/* Link to Magic Eden marketplace */}
                    <a
                        href="https://magiceden.io/marketplace/lil_gargs_ogs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-pink-600 text-white font-bold rounded-xl shadow-md hover:bg-pink-700 transition transform hover:scale-105"
                    >
                        Buy on Magic Eden
                    </a>
                </div>
            </div>
        </section>
    );
};

export default MintDetails;