
import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { ParcTalkInterpreter } from '../../services/parcTalk';
import { Visuals } from '../../services/visuals';
import { IconBrain } from '../Icons';

export const ParcBar = () => {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const dispatch = useOSStore(s => s.dispatch);
  const cmfk = useOSStore(s => s.cmfk);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(o => !o);
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const intent = ParcTalkInterpreter.parse(input);
    const result = dispatch(intent);
    setFeedback(result);
    setInput('');
    setTimeout(() => {
        setFeedback(null);
        setIsOpen(false);
    }, 1500);
  };

  if (!isOpen) return null;

  const style = Visuals.getBarStyle(cmfk);
  const glowOpacity = 0.5 + (cmfk.k * 0.5);

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh]" onClick={() => setIsOpen(false)}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px] transition-opacity duration-500"></div>
      
      <div 
        className="w-[680px] rounded-3xl overflow-hidden transition-all duration-500 ease-out transform"
        style={style}
        onClick={e => e.stopPropagation()}
        onPointerDown={e => e.stopPropagation()}
      >
         <form onSubmit={handleSubmit} className="p-6 flex items-center gap-6 relative overflow-hidden">
             {/* Breathing Orb */}
             <div className="relative w-10 h-10 flex items-center justify-center">
                 <div className="absolute inset-0 rounded-full bg-blue-500 blur-xl animate-pulse" style={{ opacity: glowOpacity }}></div>
                 <IconBrain className="w-6 h-6 text-white relative z-10" />
             </div>

             <input 
                autoFocus
                className="flex-1 bg-transparent text-2xl text-white outline-none placeholder-white/20 font-light tracking-wide"
                placeholder="What is your intent?"
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
             />
             
             {/* Confidence Indicator */}
             <div className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
                 CONF: {(cmfk.c * 100).toFixed(0)}%
             </div>
         </form>
         
         {/* CMFK Viz Strip */}
         <div className="h-1 w-full flex opacity-90">
             <div style={{width: `${cmfk.c*100}%`}} className="bg-emerald-400 h-full shadow-[0_0_15px_currentColor]" />
             <div style={{width: `${cmfk.m*100}%`}} className="bg-rose-500 h-full shadow-[0_0_15px_currentColor]" />
             <div style={{width: `${cmfk.f*100}%`}} className="bg-slate-400 h-full shadow-[0_0_15px_currentColor]" />
             <div style={{width: `${cmfk.k*100}%`}} className="bg-cyan-400 h-full shadow-[0_0_15px_currentColor]" />
         </div>

         {feedback && (
             <div className="px-6 py-4 bg-white/5 text-sm text-white/80 font-mono border-t border-white/5 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                 {feedback}
             </div>
         )}
      </div>
    </div>
  );
};
