
import { useRef, useEffect, useCallback } from 'react';
import { PhysicsState, PhysicsConfig, Vector2 } from '../types';
import { Vec2, MathUtils } from './math';

// Default Physics Configuration
const DEFAULT_CONFIG: PhysicsConfig = {
  stiffness: 120, // Spring constant (k)
  damping: 15,    // Damping coefficient (c)
  mass: 1,
};

const Z_SPRING_CONFIG = { stiffness: 180, damping: 20, mass: 1 };
const TILT_FACTOR = 0.05;

/**
 * Solves F = -kx - cv
 */
const solveSpring = (
  current: number,
  target: number,
  velocity: number,
  k: number,
  c: number,
  m: number
): number => {
  const displacement = current - target;
  const springForce = -k * displacement;
  const dampingForce = -c * velocity;
  const totalForce = springForce + dampingForce;
  return totalForce / m;
};

export const usePhysicsLoop = (
  initialPos: Vector2,
  targetScale: number,
  config: PhysicsConfig = DEFAULT_CONFIG,
  isActive: boolean
) => {
  // We store everything in a Ref to avoid React re-renders during the 60fps loop
  const state = useRef({
    position: { ...initialPos },
    velocity: { x: 0, y: 0 },
    target: { ...initialPos },
    
    // Z-Axis Physics (Lift)
    z: isActive ? 100 : 0,
    zVelocity: 0,
    zTarget: isActive ? 100 : 0,

    // Rotation (Tilt)
    rotation: { x: 0, y: 0 },
    
    scale: targetScale,
    
    // Interaction State
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    
    startTime: Date.now()
  });

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  // External Control Methods
  const setTarget = useCallback((x: number, y: number) => {
      state.current.target = { x, y };
  }, []);

  const startDrag = useCallback((pointerX: number, pointerY: number) => {
      state.current.isDragging = true;
      // Calculate offset so the window doesn't "snap" to the mouse center
      state.current.dragOffset = {
          x: pointerX - state.current.position.x,
          y: pointerY - state.current.position.y
      };
      // Lift the window higher when dragging
      state.current.zTarget = 200; 
  }, []);

  const updateDrag = useCallback((pointerX: number, pointerY: number) => {
      if (!state.current.isDragging) return;
      
      const newX = pointerX - state.current.dragOffset.x;
      const newY = pointerY - state.current.dragOffset.y;
      
      // Calculate instantaneous velocity for "Throw" physics
      const dt = 0.016; // Approx 60fps
      state.current.velocity = {
          x: (newX - state.current.position.x) / dt,
          y: (newY - state.current.position.y) / dt
      };
      
      state.current.position = { x: newX, y: newY };
  }, []);

  const endDrag = useCallback(() => {
      state.current.isDragging = false;
      // Set the target to the release position so the spring settles there
      // (or adds inertia if we want it to slide, but for OS windows, stopping at release is standard)
      state.current.target = { ...state.current.position };
      
      // Apply a bit of friction to the release velocity to dampen the throw
      state.current.velocity = Vec2.mul(state.current.velocity, 0.5); 
      
      // Drop back to active Z-height
      state.current.zTarget = 100;
      
      return state.current.position; // Return final pos for kernel sync
  }, []);

  // Main Physics Tick
  const tick = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const dt = Math.min((time - previousTimeRef.current) / 1000, 0.064);
      const s = state.current;

      // 1. XY POSITIONAL PHYSICS
      if (!s.isDragging) {
        const ax = solveSpring(s.position.x, s.target.x, s.velocity.x, config.stiffness, config.damping, config.mass);
        const ay = solveSpring(s.position.y, s.target.y, s.velocity.y, config.stiffness, config.damping, config.mass);
        
        s.velocity.x += ax * dt;
        s.velocity.y += ay * dt;
        
        s.position.x += s.velocity.x * dt;
        s.position.y += s.velocity.y * dt;
      }

      // 2. Z-AXIS PHYSICS (Lift)
      // Update Z target based on active state (passed via props/ref logic)
      const targetZ = s.isDragging ? 200 : (isActive ? 100 : 0);
      const az = solveSpring(s.z, targetZ, s.zVelocity, Z_SPRING_CONFIG.stiffness, Z_SPRING_CONFIG.damping, Z_SPRING_CONFIG.mass);
      s.zVelocity += az * dt;
      s.z += s.zVelocity * dt;

      // 3. TILT PHYSICS (Dynamic Rotation)
      // Tilt is proportional to velocity (moving right -> tilts left)
      // Target Tilt
      const tx = s.velocity.y * -TILT_FACTOR;
      const ty = s.velocity.x * TILT_FACTOR;
      
      // Smoothly interpolate current rotation to target tilt
      s.rotation.x = MathUtils.lerp(s.rotation.x, tx, 0.1);
      s.rotation.y = MathUtils.lerp(s.rotation.y, ty, 0.1);

      // 4. SCALE PHYSICS
      const scaleDiff = targetScale - s.scale;
      s.scale += scaleDiff * 0.2;
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(tick);
  }, [config, isActive, targetScale]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [tick]);

  return { 
      state, 
      setTarget,
      startDrag,
      updateDrag,
      endDrag
  };
};
