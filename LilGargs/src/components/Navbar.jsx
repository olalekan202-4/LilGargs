// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "/log.jpg";

// A new, enhanced NavLink component
const NavLink = ({ href, children, isActive, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="relative text-lg md:text-sm font-medium text-gray-300 hover:text-white transition-colors group"
  >
    {children}
    {/* Underline for desktop hover and active state */}
    <span
      className={`absolute bottom-[-4px] left-0 w-full h-0.5 bg-purple-500 transition-transform origin-center duration-300 ${
        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    ></span>
  </a>
);

const Navbar = ({ activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect for tracking scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#mint-hub", label: "Mint" },
    { href: "#leaderboard", label: "Leaderboard" },
    { href: "#collection", label: "Collection" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        // Dynamic classes for scroll effect
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/90 backdrop-blur-lg shadow-2xl"
            : "bg-gray-900/50 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center p-4 text-white">
          {/* Left side: Title and Desktop Nav */}
          <div className="flex items-center gap-8">
            <img src={Logo} alt="logo" className="h-20 w-20" />
            <h1 className="text-2xl font-bold tracking-wider hidden md:block">
              Lil Gargs
            </h1>
            <nav className="hidden md:flex gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  isActive={activeSection === item.href.substring(1)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right side: Wallet Button and Mobile Menu Icon */}
          <div className="flex items-center gap-4">
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !transition-all !duration-300" />

            {/* Hamburger Menu Icon (visible on mobile) */}
            <button
              className="md:hidden z-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <motion.div
                animate={isMenuOpen ? "open" : "closed"}
                className="w-6 h-5 flex flex-col justify-between items-center"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 8 },
                  }}
                  className="block w-full h-0.5 bg-white"
                ></motion.span>
                <motion.span
                  variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                  className="block w-full h-0.5 bg-white"
                ></motion.span>
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -8 },
                  }}
                  className="block w-full h-0.5 bg-white"
                ></motion.span>
              </motion.div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-50%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full h-screen bg-gray-900/95 backdrop-blur-xl z-30 md:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-12">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  isActive={activeSection === item.href.substring(1)}
                  onClick={() => setIsMenuOpen(false)} // Close menu on click
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
