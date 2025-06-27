// src/App.jsx
import React, { useState, useMemo } from "react";
import { useWallet, WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
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
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import ComingSoon from "./components/ComingSoon";


// Mainnet RPC endpoint for production
const network = "https://mainnet.helius-rpc.com/?api-key=ALqazXdcf4sB3oAkJWYaVVPJuarLyhEXn6yQR3RxFjjU"; // IMPORTANT: Use a reliable mainnet RPC

function App() {
  const wallet = useWallet();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

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

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        
        <MintDetails
          launchpadInfo={launchpadInfo}
          loading={loading}
          error={error}
          collectionNfts={collectionNfts}
        />

        {wallet.connected && (
          <div className="flex flex-col items-center gap-6 my-12">
            <MintButton showMessage={showMessage} refresh={refresh} launchpadInfo={launchpadInfo} />
          </div>
        )}

        {/* --- Live Mining Dashboard --- */}
        {wallet.connected && (
           <Dashboard ownedNfts={ownedNfts} loading={loading} />
        )}

        {/* --- Owned NFTs Section --- */}
        {wallet.connected && (
          <NFTGallery
            nfts={ownedNfts}
            loading={loading}
            error={error ? "Failed to load your NFTs." : null}
            title="Your Owned Gargs"
          />
        )}
        
        {/* --- Leaderboard & Stats Section --- */}
        <Leaderboard />
        
        {/* --- Coming Soon Section --- */}
        <ComingSoon />

        {/* --- Collection Preview Section --- */}
        <NFTGallery
            nfts={collectionNfts}
            loading={loading}
            error={error ? "Failed to load collection NFTs." : null}
            title="Lil Gargs OGs Collection"
          />

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
