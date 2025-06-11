// src/App.jsx
import { useEffect, useState } from "react";
import { useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { getProvider, getProgram } from "./connection"; // Assuming 'connection.js' or similar
import { clusterApiUrl, SystemProgram } from "@solana/web3.js"; // Corrected: Import SystemProgram directly

// Import wallet adapters you want to support
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// Default styles that come with wallet adapter
import "@solana/wallet-adapter-react-ui/styles.css";

// Assuming MintSection is a separate component you want to use
import MintSection from './components/MintButton'; // Adjust path as necessary

const network = clusterApiUrl("devnet"); // or 'mainnet-beta', or your local cluster

// MessageDisplay component for showing alerts gracefully
const MessageDisplay = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const borderColor = type === "success" ? "border-green-400" : "border-red-400";

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-lg flex items-center justify-between z-50 ${bgColor} ${textColor} border ${borderColor}`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
      <button onClick={onClose} className="ml-4 font-bold text-lg leading-none">
        &times;
      </button>
    </div>
  );
};


function App() {
  const wallet = useWallet();
  const [program, setProgram] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  useEffect(() => {
    // Initialize the Solana program when the wallet connects
    if (wallet.connected) {
      // getProvider and getProgram are utility functions from connection.js
      // They set up the connection to the Solana cluster and the Anchor program.
      const provider = getProvider(wallet);
      const programInstance = getProgram(provider);
      setProgram(programInstance);
    }
  }, [wallet]);

  // Function to show messages
  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    // Automatically hide the message after 5 seconds
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  // Handler for a general contract interaction, e.g., 'initialize'
  // This function demonstrates how to call a method on your Solana smart contract.
  const handleInitialize = async () => {
    if (!program) {
      showMessage("Wallet not connected!", "error");
      return;
    }

    try {
      // Example: call an RPC method named `initialize` from your smart contract
      // Replace with your own method name and params if different
      const tx = await program.rpc.initialize({
        accounts: {
          user: wallet.publicKey, // The user's public key (wallet address)
          systemProgram: SystemProgram.programId, // Corrected: Use SystemProgram directly
        },
      });
      showMessage(`Transaction sent: ${tx}`, "success");
    } catch (error) {
      console.error("Transaction error:", error);
      showMessage(`Error: ${error.message}`, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-inter">
      {/* MessageDisplay component to show transient notifications */}
      <MessageDisplay
        message={message}
        type={messageType}
        onClose={() => setMessage('')}
      />
      <h1 className="text-4xl font-bold mb-8 text-indigo-400">Lil Gargs NFT Mint</h1>

      {/* Wallet connect button, styled with Tailwind */}
      {/* WalletMultiButton handles connecting and disconnecting wallets */}
      <div className="mb-8">
        <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 !text-white !rounded-xl !px-6 !py-3" />
      </div>

      {/* Conditional rendering: show these elements only when a wallet is connected */}
      {wallet.connected && (
        <div className="flex flex-col items-center gap-6">
          {/* Example button to call an 'initialize' method on your program */}
          <button
            onClick={handleInitialize}
            className="px-8 py-4 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
          >
            Initialize Program
          </button>

          {/* MintSection component for NFT minting */}
          {/* We pass the showMessage function down to MintSection so it can display notifications */}
          <MintSection showMessage={showMessage} />
        </div>
      )}
    </div>
  );
}

// Wrap your app in WalletProvider and WalletModalProvider
// This part sets up the Solana wallet context for the entire application.
// The 'wallets' array specifies which Solana wallets are supported (Phantom, Solflare).
// 'autoConnect' attempts to automatically connect to a previously connected wallet.
const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

export default function AppWithProvider() {
  return (
    <WalletProvider wallets={wallets} autoConnect>
      {/* WalletModalProvider handles the UI for selecting and managing wallets */}
      <WalletModalProvider>
        {/* The main App component is rendered as a child */}
        <App />
      </WalletModalProvider>
    </WalletProvider>
  );
}
