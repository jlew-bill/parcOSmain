
import { create } from 'zustand';
import { AppID, KernelState, Intent, WindowKernelState } from '../types';
import { CMFKEngine } from '../services/cmfk';

interface OSStore extends KernelState {
  dispatch: (intent: Intent) => string;
  
  // Internal Reducers
  _openWindow: (appId: AppID) => void;
  _updateWindow: (id: string, updates: Partial<WindowKernelState>) => void;
  _focusWindow: (id: string) => void;
  _closeWindow: (id: string) => void;
}

const DEFAULT_W = 700;
const DEFAULT_H = 500;

// --- BOOT STATE GENERATOR ---
const generateBootState = (): WindowKernelState[] => {
    const startX = window.innerWidth / 2 - DEFAULT_W / 2;
    const startY = window.innerHeight / 2 - DEFAULT_H / 2;
    
    return [{
        id: 'sports-boot-1',
        appId: 'sports',
        title: 'SPORTS',
        zIndex: 10,
        isMinimized: false,
        isMaximized: false,
        targetX: startX,
        targetY: startY,
        targetWidth: DEFAULT_W,
        targetHeight: DEFAULT_H,
        currentCardIndex: 0,
        totalCards: 3
    }];
};

export const useOSStore = create<OSStore>((set, get) => ({
  // INJECT BOOT STATE HERE
  windows: generateBootState(),
  activeWindowId: 'sports-boot-1',
  cmfk: CMFKEngine.initialState,

  dispatch: (intent) => {
    const store = get();
    
    switch (intent.opcode) {
      case 'OPEN_APP': {
        if (!intent.args.target) return "Intent failed: Missing target.";
        // Check if already open, then focus
        const existing = store.windows.find(w => w.appId === intent.args.target);
        if (existing) {
            store._focusWindow(existing.id);
            return `Switched to ${intent.args.target}.`;
        }
        store._openWindow(intent.args.target as AppID);
        return "Intent executed: Process spawned.";
      }

      case 'CLOSE_APP': {
        if (intent.args.target === 'all') {
            set({ windows: [], activeWindowId: null });
            return "Desktop environment cleared.";
        }
        if (store.activeWindowId) {
            store._closeWindow(store.activeWindowId);
            return "Process terminated.";
        }
        return "No active process to terminate.";
      }

      case 'FOCUS_WINDOW': {
          const target = intent.args.target; 
          const win = store.windows.find(w => w.appId === target || w.title.toLowerCase() === target);
          if (win) {
              store._focusWindow(win.id);
              return `Focusing ${win.title}`;
          }
          return "Window not found.";
      }

      case 'SNAP_WINDOW': {
          if (!store.activeWindowId) return "No window to snap.";
          const w = window.innerWidth;
          const h = window.innerHeight;
          const gap = 24;
          let tx=0, ty=0, tw=DEFAULT_W, th=DEFAULT_H;
          
          switch(intent.args.position) {
              case 'left': tx=gap; ty=gap; tw=w/2 - gap*1.5; th=h - gap*2; break;
              case 'right': tx=w/2 + gap*0.5; ty=gap; tw=w/2 - gap*1.5; th=h - gap*2; break;
              case 'top': tx=gap; ty=gap; tw=w - gap*2; th=h/2 - gap*1.5; break;
              case 'bottom': tx=gap; ty=h/2 + gap*0.5; tw=w - gap*2; th=h/2 - gap*1.5; break;
              case 'maximize': tx=gap; ty=gap; tw=w - gap*2; th=h - gap*2; break;
          }
          
          store._updateWindow(store.activeWindowId, { targetX: tx, targetY: ty, targetWidth: tw, targetHeight: th });
          return `Window snapped ${intent.args.position}.`;
      }

      case 'NAVIGATE_STACK': {
          if (!store.activeWindowId) return "No active stack.";
          const win = store.windows.find(x => x.id === store.activeWindowId);
          if (win) {
              const dir = intent.args.direction === 'next' ? 1 : -1;
              const next = Math.min(Math.max(win.currentCardIndex + dir, 0), win.totalCards - 1);
              store._updateWindow(store.activeWindowId, { currentCardIndex: next });
              return `Stack pointer moved to ${next}.`;
          }
          return "Stack error.";
      }
          
      case 'TILE_WORKSPACE': {
          const wins = store.windows;
          if (wins.length === 0) return "No windows to tile.";
          const cols = Math.ceil(Math.sqrt(wins.length));
          const rows = Math.ceil(wins.length / cols);
          const gap = 24;
          const sw = (window.innerWidth - (gap * (cols + 1))) / cols;
          const sh = (window.innerHeight - (gap * (rows + 1))) / rows;
          
          wins.forEach((win, i) => {
             const c = i % cols;
             const r = Math.floor(i / cols);
             store._updateWindow(win.id, {
                 targetX: gap + c * (sw + gap),
                 targetY: gap + r * (sh + gap),
                 targetWidth: sw,
                 targetHeight: sh,
                 isMinimized: false
             });
          });
          return "Workspace tiled.";
      }

      case 'CLEAN_DESKTOP': {
          set(state => ({
              windows: state.windows.map(w => ({ ...w, isMinimized: true }))
          }));
          return "Desktop minimized.";
      }

      default:
        return "Unknown opcode.";
    }
  },

  _openWindow: (appId) => {
      const id = `${appId}-${Date.now()}`;
      set(state => {
          const z = state.windows.length + 1;
          const startX = window.innerWidth / 2 - DEFAULT_W / 2 + (Math.random()*40 - 20);
          const startY = window.innerHeight / 2 - DEFAULT_H / 2 + (Math.random()*40 - 20);
          return {
              windows: [...state.windows, {
                  id, appId, title: appId.toUpperCase(), zIndex: z,
                  isMinimized: false, isMaximized: false,
                  targetX: startX, targetY: startY, targetWidth: DEFAULT_W, targetHeight: DEFAULT_H,
                  currentCardIndex: 0, totalCards: 1
              }],
              activeWindowId: id
          };
      });
  },

  _updateWindow: (id, updates) => {
      set(state => ({
          windows: state.windows.map(w => w.id === id ? { ...w, ...updates } : w)
      }));
  },

  _closeWindow: (id) => {
      set(state => ({
          windows: state.windows.filter(w => w.id !== id),
          activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
      }));
  },

  _focusWindow: (id) => {
      set(state => {
          const maxZ = state.windows.reduce((max, w) => Math.max(max, w.zIndex), 0);
          return {
              activeWindowId: id,
              windows: state.windows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w)
          };
      });
  }
}));
