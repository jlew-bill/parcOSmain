
import React from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Visuals } from '../../services/visuals';
import { IconTrophy, IconDollarSign, IconPenTool, IconLayout } from '../Icons';

export const Dock = () => {
  const dispatch = useOSStore(s => s.dispatch);
  const cmfk = useOSStore(s => s.cmfk);

  const launch = (target: string) => {
      dispatch({ 
          opcode: 'OPEN_APP', 
          args: { target }, 
          source: 'user', 
          confidence: 1 
      });
  };

  const dockStyle = Visuals.getDockStyle(cmfk);

  const btnClass = "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group relative overflow-visible hover:-translate-y-4 hover:scale-110";
  const iconBase = "text-white/80 group-hover:text-white transition-colors relative z-20 w-6 h-6";
  const glow = "absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 z-0 rounded-full";

  return (
    <div 
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-6 p-4 rounded-[40px] z-50 ring-1 ring-white/10"
        style={dockStyle}
        onPointerDown={(e) => e.stopPropagation()} /* Prevent clicks passing to scene */
    >
        <button onClick={() => launch('sports')} className={btnClass}>
            <div className={glow} style={{ background: 'rgba(255, 200, 100, 0.4)' }} />
            <IconTrophy className={iconBase} />
            <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-[10px] text-white font-medium tracking-wide transition-opacity">SPORTS</div>
        </button>
        <button onClick={() => launch('nil')} className={btnClass}>
             <div className={glow} style={{ background: 'rgba(100, 255, 100, 0.4)' }} />
            <IconDollarSign className={iconBase} />
             <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-[10px] text-white font-medium tracking-wide transition-opacity">NIL</div>
        </button>
        <button onClick={() => launch('creator')} className={btnClass}>
             <div className={glow} style={{ background: 'rgba(200, 100, 255, 0.4)' }} />
            <IconPenTool className={iconBase} />
             <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-[10px] text-white font-medium tracking-wide transition-opacity">CREATOR</div>
        </button>
        <button onClick={() => launch('board')} className={btnClass}>
             <div className={glow} style={{ background: 'rgba(100, 200, 255, 0.4)' }} />
            <IconLayout className={iconBase} />
             <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-[10px] text-white font-medium tracking-wide transition-opacity">BOARD</div>
        </button>
    </div>
  );
};
