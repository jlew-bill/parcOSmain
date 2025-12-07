
export type AppID = 'sports' | 'nil' | 'creator' | 'board' | 'settings' | 'browser';

// --- MATH PRIMITIVES ---
export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

// --- PHYSICS ENGINE ---
export interface PhysicsState {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  target: Vector2;
  rotation: Vector2; // Tilt
  scale: number;
}

export interface PhysicsConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

// --- COGNITIVE ENGINE ---
export interface CMFKState {
  c: number; // Correctness (0-1)
  m: number; // Misconception (0-1)
  f: number; // Fog (0-1)
  k: number; // Knowingness (0-1)
}

// --- KERNEL STATE ---
export interface WindowKernelState {
  id: string;
  appId: AppID;
  title: string;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  
  // LOGICAL TARGETS (The Physics Engine chases these)
  targetX: number;
  targetY: number;
  targetWidth: number;
  targetHeight: number;
  
  // App State (HyperCard)
  currentCardIndex: number;
  totalCards: number;
}

export interface KernelState {
  windows: WindowKernelState[];
  activeWindowId: string | null;
  cmfk: CMFKState;
}

// --- INTENT PIPELINE ---
export interface Intent {
  opcode: 
    | 'OPEN_APP' 
    | 'CLOSE_APP' 
    | 'SNAP_WINDOW' 
    | 'TILE_WORKSPACE' 
    | 'CLEAN_DESKTOP' 
    | 'NAVIGATE_STACK' 
    | 'UNKNOWN';
  args: Record<string, any>;
  source: 'user' | 'system';
  confidence: number;
}

export interface AppProps {
  windowId: string;
  isActive: boolean;
  currentCard: number;
  setTotalCards: (count: number) => void;
  navigateCard: (direction: 'next' | 'prev' | number) => void;
}
