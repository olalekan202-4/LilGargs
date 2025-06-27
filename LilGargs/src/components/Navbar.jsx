// src/components/Navbar.jsx
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Navbar = () => {
    return (
        <header className="bg-gray-900/50 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-gray-700/50">
            <div className="container mx-auto flex justify-between items-center p-4 text-white">
                {/* Site Title */}
                <h1 className="text-2xl font-bold tracking-wider">
                    Lil Gargs
                </h1>

                {/* Wallet Connector */}
                <WalletMultiButton 
                    className="!bg-purple-600 hover:!bg-purple-700 !transition-all !duration-300" 
                />
            </div>
        </header>
    );
};

export default Navbar;
