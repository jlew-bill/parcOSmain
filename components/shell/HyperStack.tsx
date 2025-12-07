import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '../../store/useOSStore';

interface HyperStackProps {
  currentCardIndex: number;
  totalCards: number;
  children: React.ReactNode[];
}

/**
 * HyperStack Engine
 * Implements 4D Navigation (Stack Depth) with 3D Spatial Transitions.
 * Treats children as discrete Cards on a Z-manifold.
 */
export const HyperStack: React.FC<HyperStackProps> = ({ 
  currentCardIndex, 
  totalCards, 
  children 
}) => {
  const cmfk = useOSStore(state => state.cmfk);

  // Calculate physics damping based on cognitive "Fog"
  // High fog = slower, heavier transitions (cognitive load simulation)
  const damping = 30 + (cmfk.f * 20); 
  const stiffness = 300 - (cmfk.f * 100);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      z: -100,
      opacity: 0,
      rotateY: direction > 0 ? 15 : -15,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      z: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness,
        damping,
        mass: 1
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      z: -200, // Push deep into background (4D depth)
      opacity: 0,
      rotateY: direction < 0 ? 15 : -15,
      scale: 0.8,
      transition: {
        type: "spring",
        stiffness,
        damping,
        mass: 1
      }
    })
  };

  // We infer direction simply for this demo, ideal implementation would track prev index
  const direction = 1; 

  return (
    <div className="relative w-full h-full perspective-container overflow-hidden rounded-b-2xl">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentCardIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full bg-transparent backface-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Glass surface simulation for the card itself */}
          <div className="w-full h-full relative">
             {children[currentCardIndex]}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* 4D Stack Depth Indicator (The "Hyper" visualizer) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-50 pointer-events-none">
          {Array.from({ length: totalCards }).map((_, i) => (
              <motion.div
                  key={i}
                  animate={{ 
                      scale: i === currentCardIndex ? 1.5 : 1,
                      backgroundColor: i === currentCardIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)'
                  }}
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-colors duration-300"
              />
          ))}
      </div>
    </div>
  );
};