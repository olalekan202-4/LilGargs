// src/App.jsx
import React, { useState, useMemo } from "react";
import { useWallet, WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

// --- New/Updated Imports ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MessageDisplay from './components/MessageDisplay';
import NFTGallery from './components/NFTGallery';
import MintDetails from "./components/MintDetails";
import MintButton from "./components/MintButton";
import { useGensuki } from './hooks/useGensuki';

// Mainnet RPC endpoint for production
const network = "https://mainnet.helius-rpc.com/?api-key=ALqazXdcf4sB3oAkJWYaVVPJuarLyhEXn6yQR3RxFjjU"; // IMPORTANT: Use a reliable mainnet RPC

function App() {
  const wallet = useWallet();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  // --- Use the new Gensuki hook ---
  const {
    launchpadInfo,
    collectionNfts,
    ownedNfts,
    loading,
    error,
    refresh
  } = useGensuki(wallet.publicKey?.toBase58());

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      <MessageDisplay
        message={message}
        type={messageType}
        onClose={() => setMessage('')}
      />

      <Navbar />

      {/* --- Dynamic Mint Details Section --- */}
      <MintDetails
        launchpadInfo={launchpadInfo}
        loading={loading}
        error={error}
        // Pass collectionNfts to calculate available supply
        collectionNfts={collectionNfts}
      />

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {/* --- Dynamic Minting Section --- */}
        {wallet.connected && (
          <div className="flex flex-col items-center gap-6 mt-10">
            <MintButton showMessage={showMessage} refresh={refresh} launchpadInfo={launchpadInfo} />
          </div>
        )}

        {/* --- Collection Gallery Section --- */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-2 text-emerald-300 text-center">Lil Gargs OGs Collection</h2>
          {/* Explanatory text added */}
          <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
            This is a preview of the NFTs in the collection. Minting will grant you a randomly selected NFT.
          </p>
          <NFTGallery
            nfts={collectionNfts}
            loading={loading}
            error={error ? "Failed to load collection NFTs from API." : null}
            showMessage={showMessage}
          />
        </section>

        {/* --- Owned NFTs Section --- */}
        {wallet.connected && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-indigo-300 text-center">Your Owned NFTs</h2>
            <NFTGallery
              nfts={ownedNfts}
              loading={loading}
              error={error ? "Failed to load your NFTs from API." : null}
              showMessage={showMessage}
            />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

// --- Wallet Provider Setup ---
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

export default function AppWithProvider() {
  const endpoint = useMemo(() => network, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}