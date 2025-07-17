// src/components/Footer.jsx

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

const DiscordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.46v19.08c0 1.356-1.104 2.46-2.46 2.46H4.46C3.104 24 2 22.896 2 21.54V2.46C2 1.104 3.104 0 4.46 0h15.08zm-7.58-6.12c-1.732 0-3.072 1.34-3.072 3.072s1.34 3.072 3.072 3.072c1.732 0 3.072-1.34 3.072-3.072s-1.34-3.072-3.072-3.072zm-4.02 6.12c-1.732 0-3.072 1.34-3.072 3.072s1.34 3.072 3.072 3.072c1.732 0 3.072-1.34 3.072-3.072s-1.34-3.072-3.072-3.072zm8.04 0c-1.732 0-3.072 1.34-3.072 3.072s1.34 3.072 3.072 3.072c1.732 0 3.072-1.34 3.072-3.072s-1.34-3.072-3.072-3.072z" />
  </svg>
);

const Footer = () => {
  const funFact = "Did you know OGs will unlock fusion first?";

  return (
    <footer className="bg-gray-900/50 border-t border-gray-700/50 mt-16">
      <div className="container mx-auto py-8 px-4 text-center text-gray-400">
        <div className="mb-4">
          <h3 className="font-bold text-purple-300">
            A Cosmic Fragment of Lore
          </h3>
          <p className="max-w-3xl mx-auto text-sm mt-2">
            Lil’ Gargs are ancient cosmic fragments reborn into digital
            guardians. OGs are the elite — they mine $GARG at 1.5× speed and
            unlock the future of the Gargiverse.
          </p>
        </div>
        <div className="my-6">
          <h4 className="font-bold text-cyan-300">Daily Fun Fact</h4>
          <p className="text-sm mt-1">"{funFact}"</p>
        </div>

        <div className="flex justify-center items-center gap-8 my-8">
          <a
            href="https://x.com/lilgargs88?s=21"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors"
            aria-label="Twitter"
          >
            <TwitterIcon />
          </a>
          <a
            href="https://discord.gg/5mdVj5t8qk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-400 transition-colors"
            aria-label="Discord"
          >
            <img src='https://img.icons8.com/?size=100&id=65646&format=png&color=000000' alt="discord" className='h-10 w-10' />
          </a>
        </div>

        <div className="flex justify-center gap-6 my-6 text-xs">
          <a
            href="https://drive.google.com/file/d/1Gem8XTD_VwFJoFGLyn1blq3kh8ss75K4/view?usp=drivesdk"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            About Us
          </a>
          <span className="text-gray-600">|</span>
          <a
            href="mailto:MiniCreaturestudio@gmail.com"
            className="hover:text-white transition-colors"
          >
            Contact Us
          </a>
        </div>

        <p className="text-xs">
          &copy; {new Date().getFullYear()} Lil Gargs. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
