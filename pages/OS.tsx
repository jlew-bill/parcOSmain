
import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import { WindowFrame } from '../components/shell/WindowFrame';
import { Dock } from '../components/shell/Dock';
import { ParcBar } from '../components/shell/ParcBar';
import { SportsStack } from '../apps/SportsStack';
import { NILStack } from '../apps/NILStack';
import { CreatorStack } from '../apps/CreatorStack';
import { BoardStack } from '../apps/BoardStack';
import { AppProps } from '../types';
import { Visuals } from '../services/visuals';

// App Factory
const AppRenderer = ({ appId, windowId }: { appId: string, windowId: string }) => {
    const kernel = useOSStore();
    const win = kernel.windows.find(w => w.id === windowId);
    if (!win) return null;

    const props: AppProps = {
        windowId,
        isActive: kernel.activeWindowId === windowId,
        currentCard: win.currentCardIndex,
        setTotalCards: (n) => kernel._updateWindow(windowId, { totalCards: n }),
        navigateCard: (dir) => {
            const d = dir === 'next' ? 1 : dir === 'prev' ? -1 : 0; 
            if (typeof dir === 'number') kernel._updateWindow(windowId, { currentCardIndex: dir });
            else kernel._updateWindow(windowId, { currentCardIndex: win.currentCardIndex + d });
        }
    };

    switch(appId) {
        case 'sports': return <SportsStack {...props} />;
        case 'nil': return <NILStack {...props} />;
        case 'creator': return <CreatorStack />;
        case 'board': return <BoardStack />;
        default: return null;
    }
};

export const OS = () => {
  const windows = useOSStore(s => s.windows);
  const activeId = useOSStore(s => s.activeWindowId);
  const cmfk = useOSStore(s => s.cmfk);
  const bgRef = useRef<HTMLDivElement>(null);

  // Global Compositor Loop for Atmosphere
  useLayoutEffect(() => {
      if (!bgRef.current) return;
      
      const style = Visuals.getAtmosphere(cmfk);
      bgRef.current.style.background = style.background;
      bgRef.current.style.transition = style.transition;

  }, [cmfk]);

  // Global Parallax Camera Engine
  const handleMouseMove = (e: React.MouseEvent) => {
      // Normalize to -1...1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      // Broadcast to CSS for high-perf access
      document.body.style.setProperty('--p-x', x.toFixed(4));
      document.body.style.setProperty('--p-y', y.toFixed(4));
  };

  return (
    <div 
        className="fixed inset-0 overflow-hidden relative selection:bg-cyan-500/30 font-sans bg-black"
        onMouseMove={handleMouseMove}
        style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
    >
        
        {/* SPATIAL ATMOSPHERE - Layer 0 (Bottom) */}
        <div 
            ref={bgRef}
            className="absolute inset-0 z-[-1] pointer-events-none transform-gpu"
        >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] mix-blend-overlay"></div>
        </div>

        {/* SCENE COMPOSITOR LAYER - Layer 1 (Middle) */}
        {/* Everything inside here is positioned absolutely via matrix3d */}
        <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
             {/* Windows require pointer-events-auto on themselves */}
             {windows.map(win => (
                 <div key={win.id} className="pointer-events-auto">
                    <WindowFrame data={win} isActive={win.id === activeId}>
                        <AppRenderer appId={win.appId} windowId={win.id} />
                    </WindowFrame>
                 </div>
             ))}
        </div>

        {/* SYSTEM CHROME LAYERS - Layer 2 (Top) */}
        <div className="absolute inset-0 z-[100] pointer-events-none">
            <div className="pointer-events-auto">
                <Dock />
            </div>
            <div className="pointer-events-auto">
                <ParcBar />
            </div>
        </div>

    </div>
  );
};
