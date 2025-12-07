
import { CMFKState, PhysicsConfig } from '../types';

export class CMFKEngine {
  static initialState: CMFKState = {
    c: 0.8,
    m: 0.1,
    f: 0.05,
    k: 0.9,
  };

  /**
   * Calculates Physics Constants based on Cognitive State.
   * Fog increases damping (sluggishness).
   * Knowingness increases stiffness (snappiness).
   */
  static getPhysicsConfig(state: CMFKState): PhysicsConfig {
    const baseStiffness = 150;
    const baseDamping = 20;

    return {
      stiffness: baseStiffness + (state.k * 60) - (state.f * 40),
      damping: baseDamping + (state.f * 25),
      mass: 1 + (state.m * 0.8), // Misconceptions make things "heavy" and hard to move
    };
  }

  static clamp(val: number): number {
      return Math.min(Math.max(val, 0), 1);
  }
}
    