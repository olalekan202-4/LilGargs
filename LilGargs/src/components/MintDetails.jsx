// src/components/MintDetails.jsx
import React from 'react';

const MintDetails = ({ launchpadInfo, loading, error }) => {
    if (loading) {
        return (
            <div className="text-center p-10">
                <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-500 mx-auto"></div>
                <p className="text-lg mt-4 text-gray-300">Loading Mint Details...</p>
            </div>
        );
    }

    if (error || !launchpadInfo) {
        return (
            <div className="text-center p-10 bg-red-900/20 rounded-lg">
                <p className="text-xl text-red-400">Could not load launchpad details.</p>
                <p className="text-sm text-gray-400 mt-2">{error}</p>
            </div>
        );
    }

    const {
        projectName,
        projectImageUrl,
        projectDescription,
        supply,
        publicPhaseStart,
    } = launchpadInfo;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    return (
        <section className="container mx-auto p-4 sm:p-6 lg:p-8 my-12 bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1 flex justify-center">
                    <img
                        src={projectImageUrl}
                        alt={`${projectName} cover`}
                        className="w-64 h-64 rounded-xl object-cover shadow-lg border-2 border-purple-500"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300/312e81/ffffff?text=Image'; }}
                    />
                </div>
                <div className="md:col-span-2 text-center md:text-left">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">{projectName}</h1>
                    <p className="text-gray-300 text-lg mb-6">{projectDescription}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-lg">
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <span className="font-bold text-purple-400">Total Supply:</span>
                            <span className="ml-2 text-white">{supply ? `${supply} NFTs` : 'N/A'}</span>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <span className="font-bold text-emerald-400">Public Mint:</span>
                            <span className="ml-2 text-white">{publicPhaseStart ? formatDate(publicPhaseStart) : 'TBA'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MintDetails;