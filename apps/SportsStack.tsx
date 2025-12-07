import React, { useState, useEffect } from 'react';
import { IconTrophy, IconActivity } from '../components/Icons';
import { AppProps } from '../types';
import { HyperStack } from '../components/shell/HyperStack';

export const SportsStack: React.FC<AppProps> = ({ currentCard, setTotalCards, navigateCard }) => {
  
  useEffect(() => {
    setTotalCards(3); // Declare Stack Depth to OS
  }, []);

  // -- OOP Definition of Stack Content --
  // Each index corresponds to a Card Component
  const cards = [
    <SportsHub key="hub" navigate={navigateCard} />,
    <GameDetail key="game" navigate={navigateCard} />,
    <PlayerStats key="player" navigate={navigateCard} />
  ];

  return (
    <HyperStack currentCardIndex={currentCard} totalCards={3}>
      {cards}
    </HyperStack>
  );
};

// --- REAL TIME SIMULATION UTILS ---
const useGameClock = (isActive: boolean) => {
    const [time, setTime] = useState(900); 
    const [qtr, setQtr] = useState(4);
    
    useEffect(() => {
        if (!isActive) return;
        const interval = setInterval(() => {
            setTime(prev => {
                if (prev <= 0) {
                    if (qtr >= 4) return 0;
                    setQtr(q => q + 1);
                    return 900;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isActive, qtr]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return { timeStr: formatTime(time), qtr };
};

const useLiveScore = () => {
    const [homeScore, setHomeScore] = useState(24);
    const [awayScore, setAwayScore] = useState(21);
    const [lastPlay, setLastPlay] = useState("Run for 2 yards");

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                if (Math.random() > 0.5) {
                    setHomeScore(s => s + 7);
                    setLastPlay("Touchdown KC!");
                } else {
                    setAwayScore(s => s + 3);
                    setLastPlay("Field Goal BUF");
                }
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return { homeScore, awayScore, lastPlay };
};

interface NavigateProps {
    navigate: (direction: 'next' | 'prev' | number) => void;
}

// --- CARD 1: HUB ---
const SportsHub: React.FC<NavigateProps> = ({ navigate }) => {
    const { timeStr, qtr } = useGameClock(true);
    const { homeScore, awayScore, lastPlay } = useLiveScore();

    return (
        <div className="h-full flex flex-col text-white p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <IconTrophy className="text-yellow-400" /> SportsStack
                </h2>
                <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded font-bold animate-pulse">LIVE</span>
            </div>

            <div 
                onClick={() => navigate('next')}
                className="relative bg-gradient-to-br from-[#1e3a8a] to-[#000] rounded-xl border border-white/10 p-5 cursor-pointer overflow-hidden group hover:border-blue-400/50 transition-all active:scale-95 shadow-lg"
            >
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="text-xs text-blue-200 font-medium tracking-wider">GAME OF THE WEEK</div>
                    <div className="text-xs font-mono text-white/80">Q{qtr} • {timeStr}</div>
                </div>

                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="text-center">
                        <div className="text-3xl font-bold">KC</div>
                        <div className="text-xs text-white/50">12-4</div>
                    </div>
                    <div className="text-4xl font-bold text-white/90 font-mono tracking-tighter">
                        {homeScore}-{awayScore}
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">BUF</div>
                        <div className="text-xs text-white/50">13-3</div>
                    </div>
                </div>

                <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 text-center border border-white/5 relative z-10">
                    <div className="text-[10px] text-white/40 uppercase mb-1">Last Play</div>
                    <div className="text-sm font-medium text-yellow-400">{lastPlay}</div>
                </div>
            </div>
            
            <div className="text-center text-xs text-white/30 pt-4">
                Tap card for detailed stats
            </div>
        </div>
    );
};

// --- CARD 2: DETAILS ---
const GameDetail: React.FC<NavigateProps> = ({ navigate }) => {
    return (
        <div className="h-full flex flex-col text-white p-4">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => navigate('prev')} className="text-xs text-white/60 hover:text-white px-2 py-1 rounded bg-white/10">
                    ← Back
                </button>
                <span className="text-xs font-bold tracking-widest text-white/30">STATS</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
                 <div className="bg-white/5 p-3 rounded-lg text-center">
                     <div className="text-xs text-white/40">WIN PROB</div>
                     <div className="text-lg font-bold text-green-400">62%</div>
                 </div>
                 <div className="bg-white/5 p-3 rounded-lg text-center">
                     <div className="text-xs text-white/40">MOMENTUM</div>
                     <div className="text-lg font-bold text-red-400">High</div>
                 </div>
            </div>
            <div className="flex-1 bg-white/5 rounded-lg p-2 overflow-y-auto custom-scrollbar">
                <div 
                    onClick={() => navigate('next')} 
                    className="p-3 hover:bg-white/5 rounded cursor-pointer transition-colors border-l-2 border-transparent hover:border-yellow-400"
                >
                    <div className="text-xs text-white/50 mb-1">Q4 • 12:30</div>
                    <div className="text-sm font-bold">Mahomes Pass to Kelce</div>
                    <div className="text-xs text-green-400">Touchdown (12 yds)</div>
                </div>
            </div>
        </div>
    );
};

// --- CARD 3: PLAYER ---
const PlayerStats: React.FC<NavigateProps> = ({ navigate }) => {
    return (
        <div className="h-full flex flex-col text-white p-4">
            <button onClick={() => navigate('prev')} className="text-xs text-white/60 hover:text-white mb-6 self-start flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                ← Back to Game
            </button>
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-red-800 flex items-center justify-center text-xl font-bold border-2 border-white/20 shadow-lg shadow-red-900/50">
                    PM
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Patrick Mahomes</h2>
                    <div className="text-xs text-red-400">QB • Chiefs</div>
                </div>
            </div>
            <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-blue-300 mb-2 flex items-center gap-2">
                    <IconActivity className="w-4 h-4" /> AI Analysis
                </h3>
                <p className="text-xs text-blue-100/70 leading-relaxed">
                    Performance exceeds season average by 14%. High probability of deep pass on next drive.
                </p>
            </div>
        </div>
    );
};