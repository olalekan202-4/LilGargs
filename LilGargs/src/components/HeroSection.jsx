// src/components/HeroSection.jsx
const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-indigo-900 to-purple-800 text-white py-20 text-center shadow-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-extrabold mb-4 leading-tight">
          Discover & Mint Unique Digital Collectibles
        </h2>
        <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
          Explore the world of Lil Gargs NFTs on Solana – own a piece of the future,
          and potentially earn Gargs Coin!
        </p>
        {/* You could add a call-to-action button here if desired */}
        {/* <button className="px-8 py-3 bg-white text-indigo-600 rounded-full text-lg font-semibold hover:bg-gray-100 transition">
          Browse NFTs
        </button> */}
      </div>
    </section>
  );
};

export default HeroSection;