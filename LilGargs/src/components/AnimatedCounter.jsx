// src/components/AnimatedCounter.jsx
import React, { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

const AnimatedCounter = ({ from, to }) => {
  const nodeRef = useRef();

  useEffect(() => {
    const node = nodeRef.current;

    const controls = animate(from, to, {
      duration: 1,
      onUpdate(value) {
        if(node) {
            node.textContent = value.toFixed(6);
        }
      },
    });

    return () => controls.stop();
  }, [from, to]);

  return <span ref={nodeRef} />;
};

export default AnimatedCounter;