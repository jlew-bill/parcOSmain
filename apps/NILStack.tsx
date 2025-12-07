import React, { useEffect } from 'react';
import { IconDollarSign, IconActivity } from '../components/Icons';
import { AppProps } from '../types';
import { HyperStack } from '../components/shell/HyperStack';

export const NILStack: React.FC<AppProps> = ({ currentCard, setTotalCards }) => {
  
  useEffect(() => {
    setTotalCards(1);
  }, []);

  const CardDashboard = () => (
    <div className="h-full flex flex-col text-white p-4">
        <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <IconDollarSign className="text-green-400" />
                NIL Valuation
            </h1>
            <p className="text-sm text-white/50">Projected Earnings Dashboard</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md">
                <div className="text-xs text-white/50 uppercase tracking-wide">Market Value</div>
                <div className="text-2xl font-bold text-green-400">$1.2M</div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md">
                <div className="text-xs text-white/50 uppercase tracking-wide">Deals Active</div>
                <div className="text-2xl font-bold text-blue-400">8</div>
            </div>
        </div>

        <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col justify-center items-center relative overflow-hidden backdrop-blur-sm group">
            <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <IconActivity className="w-12 h-12 text-white/20 mb-2" />
            <span className="relative z-10 text-sm text-white/40">Graph Visualization Placeholder</span>
        </div>
    </div>
  );

  return (
    <HyperStack currentCardIndex={currentCard} totalCards={1}>
       {[<CardDashboard key="dash" />]}
    </HyperStack>
  );
};