
import React, { useRef, useLayoutEffect } from 'react';
import { WindowKernelState } from '../../types';
import { useOSStore } from '../../store/useOSStore';
import { usePhysicsLoop } from '../../services/physics';
import { CMFKEngine } from '../../services/cmfk';
import { Visuals } from '../../services/visuals';
import { composeMatrix3d } from '../../services/math';

interface Props {
  data: WindowKernelState;
  isActive: boolean;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<Props> = ({ data, isActive, children }) => {
  const kernel = useOSStore();
  const cmfk = useOSStore(s => s.cmfk);

  // 1. Get Physics Config (CMFK Driven)
  const physConfig = CMFKEngine.getPhysicsConfig(cmfk);

  // 2. Initialize Physics Engine (Rigid Body)
  const { 
      state: physState, 
      setTarget, 
      startDrag, 
      updateDrag, 
      endDrag 
  } = usePhysicsLoop(
    { x: data.targetX, y: data.targetY },
    data.isMinimized ? 0.8 : 1.0,
    physConfig,
    isActive
  );

  // Sync Kernel Targets
  useLayoutEffect(() => {
    setTarget(data.targetX, data.targetY);
  }, [data.targetX, data.targetY, setTarget]);

  // 3. Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const idHash = useRef(Math.random() * 100).current; 

  // 4. Input Handlers (Unified Rigid Body Interaction)
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    kernel._focusWindow(data.id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startDrag(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    e.preventDefault();
    updateDrag(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const finalPos = endDrag();
    kernel._updateWindow(data.id, { 
        targetX: finalPos.x, 
        targetY: finalPos.y 
    });
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // 5. COMPOSITOR LOOP
  useLayoutEffect(() => {
    let frameId: number;
    
    const render = () => {
      if (containerRef.current) {
        const s = physState.current;
        const now = Date.now();
        
        // A. BREATHING & WOBBLE
        const breathe = Visuals.getBreathingParams(cmfk);
        const timeDelta = now - s.startTime;
        const wobbleY = Math.sin((timeDelta * breathe.frequency) + (idHash * 0.3)) * breathe.amplitude;
        
        // B. MATERIAL SHADER PASS
        const style = Visuals.getSurfaceStyle(isActive, cmfk, s.z);
        
        // C. MATRIX COMPUTATION
        const matrix = composeMatrix3d(
            { x: s.position.x, y: s.position.y + wobbleY },
            s.z,
            s.rotation,
            s.scale
        );
        
        const el = containerRef.current;
        el.style.transform = matrix;
        // Don't set width/height here every frame, set it on data change or initial style
        el.style.opacity = style.opacity.toString();
        el.style.zIndex = data.zIndex.toString();
        
        // Apply Visuals
        el.style.background = style.background;
        el.style.backdropFilter = style.backdropFilter;
        el.style.borderColor = style.borderColor;
        el.style.borderRadius = style.borderRadius;
        el.style.boxShadow = style.boxShadow;
      }
      frameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frameId);
  }, [isActive, cmfk, data.zIndex]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 will-change-transform border transition-none"
      style={{ 
          transformStyle: 'preserve-3d', 
          width: `${data.targetWidth}px`, 
          height: `${data.targetHeight}px` 
      }}
    >
        {/* HULL CONTENT */}
        <div className="w-full h-full relative overflow-hidden flex flex-col rounded-[inherit]">
            
            {/* CHROME HANDLE */}
            <div 
                className="h-10 w-full flex items-center px-4 cursor-grab active:cursor-grabbing shrink-0 z-20"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                 <div className="flex gap-2 group">
                     <button className="w-3 h-3 rounded-full bg-white/20 hover:bg-red-500/80 transition-all shadow-inner" 
                        onPointerDown={e => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); kernel.dispatch({ opcode: 'CLOSE_APP', args: { target: 'focused' }, source: 'user', confidence: 1 }); }} 
                     />
                     <div className="w-3 h-3 rounded-full bg-white/20 group-hover:bg-yellow-500/80 transition-all shadow-inner" />
                     <div className="w-3 h-3 rounded-full bg-white/20 group-hover:bg-green-500/80 transition-all shadow-inner" />
                 </div>
                 <div className="ml-4 text-[11px] font-semibold tracking-widest text-white/30 uppercase pointer-events-none select-none mix-blend-overlay">
                     {data.title}
                 </div>
            </div>
            
            {/* APP CONTENT */}
            <div 
                className="flex-1 relative overflow-hidden rounded-b-[inherit]" 
                onPointerDown={(e) => {
                    e.stopPropagation();
                    kernel._focusWindow(data.id);
                }}
            >
                {children}
            </div>
        </div>
    </div>
  );
};
