// src/components/NFTCard.jsx

const NFTCard = ({ nft, showMessage, purchaseNFT }) => {
  const handlePurchaseClick = () => {
    // This is a conceptual purchase button.
    // In a real application, this would trigger an interaction with a marketplace smart contract.
    showMessage(`Purchase functionality for "${nft.name}" is conceptual. A real marketplace integration would go here!`, "info");
    // Call the passed purchaseNFT function if provided, with the NFT data
    if (purchaseNFT) {
      purchaseNFT(nft);
    }
  };

  return (
    <div className="bg-gray-700 rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
      <img
        src={nft.imageUrl || "https://placehold.co/300x300/312e81/ffffff?text=NFT+Placeholder"} // Placeholder image
        alt={nft.name}
        className="w-full h-48 object-cover border-b border-gray-600"
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x300/312e81/ffffff?text=Image+Load+Error"; }}
      />
      <div className="p-4">
        <h4 className="text-xl font-semibold text-white mb-2 truncate">{nft.name}</h4>
        <p className="text-sm text-gray-400 mb-3 truncate">{nft.symbol}</p>
        <p className="text-sm text-gray-500 mb-3 break-words">Mint: {nft.mintAddress.toBase58().substring(0, 8)}...{nft.mintAddress.toBase58().slice(-8)}</p>
        {/* Conceptual Purchase Button */}
        <button
          onClick={handlePurchaseClick}
          className="w-full py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75"
        >
          Purchase (Conceptual)
        </button>
      </div>
    </div>
  );
};

export default NFTCard;