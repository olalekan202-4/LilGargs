// src/components/Navbar.jsx
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Navbar = ({ wallet }) => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-400">Lil Gargs NFT</h1>
        <div className="flex items-center space-x-4">
          {/* You can add other navigation links here if needed */}
          <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 !text-white !rounded-xl !px-4 !py-2" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;