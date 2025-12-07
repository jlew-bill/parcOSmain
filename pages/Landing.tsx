import React from 'react';

export const Landing = ({ onLaunch }: { onLaunch: () => void }) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black z-0 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50 mb-6">
          parcOS
        </h1>
        <p className="text-xl md:text-2xl text-white/50 max-w-2xl mb-10 font-light">
          The spatial operating system for the cognitive age. <br />
          Built with React, driven by BILL.
        </p>
        
        <div className="flex gap-4">
           <button 
             onClick={onLaunch}
             className="px-8 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform duration-300"
           >
             Launch Demo
           </button>
           <button 
             onClick={() => window.location.hash = 'pricing'}
             className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-colors"
           >
             Pricing
           </button>
        </div>
      </div>
    </div>
  );
};
