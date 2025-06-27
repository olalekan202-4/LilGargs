// src/components/MessageDisplay.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MessageDisplay = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 4500); // Hide just before the 5s timeout in App.jsx
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [message, type]);

    const bgColor = {
        info: 'bg-blue-500',
        success: 'bg-emerald-500',
        error: 'bg-red-500',
    }[type];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                    className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg text-white font-bold text-center ${bgColor}`}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MessageDisplay;
