import React from 'react';

const features = [
    { name: 'Claim $GARG', status: '🔒 Coming Soon' },
    { name: 'Fusion Chamber', status: '🔒 Coming Soon' },
    { name: 'GargShop', status: '🔒 Coming Soon' },
    { name: 'Trait Reveal', status: '🔒 Coming Soon' },
    { name: '1/1 Raffles', status: '🔒 Coming Soon' },
    { name: 'GARG → SOL Swap', status: '🔒 Coming Soon' },
];

const ComingSoon = () => {
    return (
        <section className="container mx-auto p-6 my-12">
            <h2 className="text-3xl font-bold text-center text-gray-400 mb-8">Future of the Gargiverse</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {features.map(feature => (
                    <div key={feature.name} className="bg-gray-800/50 p-6 rounded-2xl text-center border border-gray-700 shadow-lg backdrop-blur-md">
                        <h3 className="text-xl font-bold text-white mb-2">{feature.name}</h3>
                        <p className="text-purple-400 font-semibold">{feature.status}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
export default ComingSoon;