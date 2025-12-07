
import { CMFKState } from '../types';

export interface SurfaceStyle {
  background: string;
  backdropFilter: string;
  borderColor: string;
  borderImage?: string;
  boxShadow: string;
  opacity: number;
  borderRadius: string;
  transform?: string;
}

export interface AtmosphereStyle {
  background: string;
  transition: string;
}

export const Visuals = {
  /**
   * Liquid Glass Shader
   * Maps CMFK -> CSS Variables for volumetric glass simulation.
   */
  getSurfaceStyle: (active: boolean, cmfk: CMFKState, zIndex: number): SurfaceStyle => {
    // 1. INPUT VECTORS
    const F = cmfk.f; // Fog (0-1)
    const K = cmfk.k; // Knowingness (0-1)
    const M = cmfk.m; // Misconception (0-1)
    
    // 2. OPACITY & BACKGROUND
    // Formula: Base + Fog * Factor
    const bgOpacity = 0.06 + (F * 0.08); 
    const bgColor = active 
        ? `rgba(255, 255, 255, ${bgOpacity + 0.02})` 
        : `rgba(20, 20, 30, ${bgOpacity})`;

    // 3. BLUR PHYSICS
    // Saturate Fog^2, max 24px
    const blurBase = active ? 24 : 16;
    const blurVal = Math.min(32, blurBase + Math.pow(F, 2) * 20);

    // 4. RIM LIGHT (Specular)
    // Knowingness shifts gold -> white. Active state adds intensity.
    const rimOpacity = active ? 0.5 + (K * 0.3) : 0.1;
    const rimColor = K > 0.8 
        ? `rgba(200, 230, 255, ${rimOpacity})` // Blue-white (High K)
        : `rgba(255, ${200 + K * 50}, ${150 + K * 100}, ${rimOpacity})`; // Gold-ish (Low K)

    // 5. SHADOW & DEPTH
    // Misconception adds red tint. Depth increases spread.
    const shadowColor = M > 0.2 
        ? `rgba(50, 10, 10, ${0.3 + M * 0.2})` 
        : `rgba(0, 0, 0, ${active ? 0.3 : 0.2})`;
    
    const shadowY = active ? 30 : 10;
    const shadowBlur = active ? 50 : 20;

    return {
      background: `
        linear-gradient(145deg, ${bgColor} 0%, rgba(255,255,255,0.01) 100%),
        linear-gradient(to bottom, rgba(255,255,255,${active ? 0.15 : 0.05}) 0%, transparent 40%)
      `,
      backdropFilter: `blur(${blurVal}px) saturate(${100 + K * 20}%)`,
      borderRadius: '20px',
      borderColor: 'transparent',
      opacity: active ? 1 : 0.85,
      boxShadow: `
        0 ${shadowY}px ${shadowBlur}px -10px ${shadowColor},
        0 0 0 1px rgba(255,255,255,${active ? 0.15 : 0.05}),
        inset 0 1px 0 0 ${rimColor}
      `
    };
  },

  /**
   * Atmospheric Spatial Backdrop
   * Volumetric gradients driven by global cognitive state.
   */
  getAtmosphere: (cmfk: CMFKState): AtmosphereStyle => {
    const K = cmfk.k;
    const F = cmfk.f;

    // High K = Deep Blue/Void. High F = Warm Haze.
    const r = 5 + (F * 30);
    const g = 10 + (K * 10);
    const b = 20 + (K * 40);

    const vignetteOpacity = 0.4 + (F * 0.3);

    return {
      background: `
        radial-gradient(circle at 50% 0%, rgba(${r + 20},${g + 20},${b + 40}, 0.4) 0%, transparent 60%),
        linear-gradient(to bottom, rgb(${r},${g},${b}), rgb(0,0,0)),
        radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,${vignetteOpacity}) 100%)
      `,
      transition: 'background 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
    };
  },

  getBreathingParams: (cmfk: CMFKState) => {
      // Frequency: Fog slows breathing.
      // Amplitude: Confidence expands it.
      return {
          frequency: 0.0015 - (cmfk.f * 0.0005),
          amplitude: 4 + (cmfk.c * 3)
      };
  },
  
  /**
   * Dock Visuals
   */
  getDockStyle: (cmfk: CMFKState) => {
      return {
          background: 'rgba(255, 255, 255, 0.08)',
          borderColor: `rgba(255, 255, 255, ${0.1 + cmfk.k * 0.1})`,
          backdropFilter: 'blur(30px) saturate(140%)',
          boxShadow: `0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)`
      };
  },

  /**
   * ParcBar Visuals
   */
  getBarStyle: (cmfk: CMFKState) => {
      return {
          background: 'rgba(10, 10, 15, 0.7)',
          backdropFilter: 'blur(40px) saturate(180%)',
          boxShadow: `
            0 30px 60px rgba(0,0,0,0.6), 
            0 0 0 1px rgba(255,255,255,0.1),
            0 0 ${20 + cmfk.k * 30}px rgba(100, 200, 255, ${0.05 + cmfk.k * 0.1})
          `
      };
  }
};
