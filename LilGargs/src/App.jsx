// src/App.jsx
import { Buffer } from 'buffer';
window.Buffer = Buffer;

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useWallet, WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Connection } from "@solana/web3.js";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import { motion } from 'framer-motion';

// --- Core Components ---
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MessageDisplay from './components/MessageDisplay';
import NFTGallery from './components/NFTGallery';
import MintDetails from "./components/MintDetails";
import MintLive from "./components/MintLive";
import MiningHub from "./components/MiningHub";
import Leaderboard from "./components/Leaderboard";
import ComingSoon from "./components/ComingSoon";
import TierProgress from "./components/TierProgress";
import Engagement from "./components/Engagement";
import GargShop from './components/GargShop';
import { useGensuki } from "./hooks/useGensuki";
import { getMiningData, updateMiningData } from './api';

const network = "https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY_HERE";
const MINING_RATE_PER_NFT = 0.0005775;

function App() {
  const wallet = useWallet();
  const { publicKey } = wallet;

  // --- UI & Message State ---
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [activeSection, setActiveSection] = useState('mint-hub');

  // --- Data from Gensuki API (for NFTs and Minting) ---
  const {
    launchpadInfo: rawLaunchpadInfo,
    collectionNfts,
    ownedNfts,
    loading: nftsLoading,
    error: nftsError,
    refresh
  } = useGensuki(publicKey?.toBase58());

  // --- Persistent Mining & Shop State ---
  const [unclaimedGarg, setUnclaimedGarg] = useState(0);
  const [isMiningDataLoaded, setIsMiningDataLoaded] = useState(false);
  const [activeBoost, setActiveBoost] = useState(null);
  const [purchasedFlairs, setPurchasedFlairs] = useState({});

  // --- Derived State (Now driven by actual NFT count) ---
  const ogCount = Array.isArray(ownedNfts) ? ownedNfts.length : 0;
  const baseMiningRate = ogCount * MINING_RATE_PER_NFT;
  const boostMultiplier = activeBoost ? activeBoost.multiplier : 1;
  const totalMiningRate = baseMiningRate * boostMultiplier;

  const connection = useMemo(() => new Connection("https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY_HERE"), []);

  // --- Logic for Persistent Mining Data ---
  useEffect(() => {
    if (!publicKey) {
      setIsMiningDataLoaded(false);
      setUnclaimedGarg(0);
      return;
    }
    const userAddress = publicKey.toBase58();
    setIsMiningDataLoaded(false);
    getMiningData(userAddress)
      .then(data => {
        if (data && data.miningRate > 0) {
          const lastSavedTime = new Date(data.sessionStartTime).getTime();
          const currentTime = Date.now();
          const secondsOffline = Math.max(0, (currentTime - lastSavedTime) / 1000);
          const gargMinedOffline = secondsOffline * data.miningRate;
          setUnclaimedGarg(data.miningBalance + gargMinedOffline);
        } else {
          setUnclaimedGarg(0);
        }
      })
      .catch(err => showMessage("Could not load your mining data.", "error"))
      .finally(() => setIsMiningDataLoaded(true));
  }, [publicKey]);

  useEffect(() => {
    if (!isMiningDataLoaded || totalMiningRate <= 0) return;
    const interval = setInterval(() => setUnclaimedGarg(prev => prev + totalMiningRate), 1000);
    return () => clearInterval(interval);
  }, [isMiningDataLoaded, totalMiningRate]);

  useEffect(() => {
    if (!publicKey || !isMiningDataLoaded) return;
    const saveInterval = setInterval(() => {
      if (totalMiningRate > 0) {
        updateMiningData(publicKey.toBase58(), unclaimedGarg, totalMiningRate)
          .then(() => console.log("Progress saved!"))
          .catch(err => console.error("Could not save progress:", err));
      }
    }, 15000);
    return () => clearInterval(saveInterval);
  }, [publicKey, isMiningDataLoaded, unclaimedGarg, totalMiningRate]);
  
  const launchpadInfo = useMemo(() => {
    if (!rawLaunchpadInfo || !rawLaunchpadInfo.data) return null;
    const { data } = rawLaunchpadInfo;
    const now = Date.now() / 1000;
    const phases = [];
    if (data.isVipPhaseAdded) {
      let status = "Upcoming";
      if (now >= data.vipPhaseStart && (now < data.vipPhaseEnd || data.vipPhaseEnd === 0)) status = "Live";
      if (now >= data.vipPhaseEnd && data.vipPhaseEnd !== 0) status = "Ended";
      phases.push({ name: "VIP", group: "vip", price: `${data.vipPhaseAmount} SOL`, limit: `${data.vipMaxMintLimit} per Wallet`, status });
    }
    if (data.isPublicPhaseAdded) {
      let status = "Upcoming";
      if (now >= data.publicPhaseStart && (now < data.publicPhaseEnd || data.publicPhaseEnd === 0)) status = "Live";
      if (now >= data.publicPhaseEnd && data.publicPhaseEnd !== 0) status = "Ended";
      phases.push({ name: "Public", group: "pb", price: `${data.publicPhaseAmount} SOL`, limit: "UNLIMITED per Wallet", status });
    }
    return { ...data, phases };
  }, [rawLaunchpadInfo]);

  const sectionRefs = {
    'mint-hub': useRef(null),
    'leaderboard': useRef(null),
    'collection': useRef(null),
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => entry.isIntersecting && setActiveSection(entry.target.id)),
      { rootMargin: '-30% 0px -70% 0px' }
    );
    Object.values(sectionRefs).forEach(ref => ref.current && observer.observe(ref.current));
    return () => Object.values(sectionRefs).forEach(ref => ref.current && observer.unobserve(ref.current));
  }, []);

  const handleDailyClaim = (amount) => setUnclaimedGarg(prev => prev + amount);

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handlePurchase = (itemId, price) => {
    if (unclaimedGarg < price) {
      showMessage("You do not have enough $GARG.", "error");
      return;
    }
    setUnclaimedGarg(prev => prev - price);
    if (itemId === 'boost') {
      if (activeBoost) {
        showMessage("Boost already active.", "info");
        return;
      }
      setActiveBoost({ multiplier: 2, expiry: Date.now() + 86400000 });
      showMessage("2x Mining Boost activated!", "success");
      setTimeout(() => {
        setActiveBoost(null);
        showMessage("Mining boost has expired.", "info");
      }, 86400000);
    }
    if (itemId === 'flair') {
      setPurchasedFlairs(prev => ({ ...prev, [publicKey.toBase58()]: true }));
      showMessage("Leaderboard Flair purchased!", "success");
    }
    if (itemId === 'raffle') {
      console.log(`User ${publicKey.toBase58()} purchased a raffle ticket.`);
      showMessage("Raffle ticket purchased!", "success");
    }
  };

  const livePhase = useMemo(() => launchpadInfo?.phases?.find(p => p.status === 'Live'), [launchpadInfo]);
  const mintedCount = collectionNfts?.length || 0;
  const totalSupply = launchpadInfo?.supply || 0;

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col font-sans">
      <MessageDisplay message={message} type={messageType} onClose={() => setMessage('')} />
      <Navbar activeSection={activeSection} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <Hero />
        <div id="mint-hub" ref={sectionRefs['mint-hub']}>
            <MintDetails launchpadInfo={launchpadInfo} loading={nftsLoading} error={nftsError} collectionNfts={collectionNfts} />
            {wallet.connected ? (
              <>
                <div className="grid md:grid-cols-2 gap-12 items-stretch my-12">
                    {livePhase ? (
                      <MintLive livePhase={livePhase} mintedCount={mintedCount} totalSupply={totalSupply} showMessage={showMessage} refresh={refresh} connection={connection} />
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700 h-full flex flex-col justify-center items-center text-center shadow-lg">
                        <h3 className="text-2xl font-bold text-white">Mint Is Not Live</h3>
                        <p className="text-gray-400 mt-2">Please check back later.</p>
                      </motion.div>
                    )}
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="h-full">
                        <MiningHub ownedNfts={ownedNfts} unclaimedGarg={unclaimedGarg} totalMiningRate={totalMiningRate} onDailyClaim={handleDailyClaim} activeBoost={activeBoost} isDataLoaded={isMiningDataLoaded} />
                    </motion.div>
                </div>
                <TierProgress ownedNfts={ownedNfts} />
                <NFTGallery nfts={ownedNfts} loading={nftsLoading} error={nftsError ? "Failed to load your NFTs." : null} title="NFTs Minted" />
              </>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-center p-12 bg-gray-800/50 rounded-2xl border border-gray-700 my-16">
                    <h2 className="text-3xl font-bold text-white">Connect Your Wallet to Begin</h2>
                    <p className="text-gray-400 mt-2 max-w-xl mx-auto">Join the Gargoyle rebellion.</p>
                </motion.div>
            )}
        </div>
        <GargShop />
        <div id="leaderboard" ref={sectionRefs['leaderboard']}>
            <Leaderboard userWalletAddress={publicKey?.toBase58()} purchasedFlairs={purchasedFlairs} />
        </div>
        <ComingSoon />
        <Engagement unclaimedGarg={unclaimedGarg} ogCount={ogCount} totalMiningRate={totalMiningRate} />
        <div id="collection" ref={sectionRefs['collection']}>
            <NFTGallery nfts={collectionNfts} loading={nftsLoading} error={nftsError ? "Failed to load collection NFTs." : null} title="Lil Gargs OGs Collection Preview" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

export default function AppWithProvider() {
  const endpoint = useMemo(() => network, []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider><App /></WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}