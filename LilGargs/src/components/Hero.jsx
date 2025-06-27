// src/components/Hero.jsx
import React from "react";
import { motion } from "framer-motion";

const titleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const Hero = () => {
  const title = "Lil Gargs";
  const tagline = "Elemental Guardians Reborn.";

  return (
    <section className="text-center py-24 md:py-32">
      <motion.h1
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        className="text-6xl md:text-8xl font-black tracking-tighter text-white"
        style={{
          textShadow:
            "0 0 15px rgba(168, 85, 247, 0.5), 0 0 30px rgba(168, 85, 247, 0.3)",
        }}
      >
        {title.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="text-purple-300 text-xl md:text-2xl mt-4"
      >
        {tagline}
      </motion.p>
    </section>
  );
};

export default Hero;
