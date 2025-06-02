import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { WindowState } from '$lib/types';
import { UI_DIMENSIONS } from '$lib/types';

// Initial window states
const initialWindows: Record<string, WindowState> = {
  'chatbot': {
    id: 'chatbot',
    title: 'CHATBOT',
    isOpen: false,
    zIndex: 100,
    position: { x: 50, y: 50 },
    size: { width: 400, height: 300 },
    isMaximized: false,
    isMinimized: false
  },
  'oscillator': {
    id: 'oscillator',
    title: 'OSCILLATOR',
    isOpen: false,
    zIndex: 100,
    position: { x: 50, y: 50 },
    size: { width: 600, height: 400 },
    isMaximized: false,
    isMinimized: false
  },
  'numerology': {
    id: 'numerology',
    title: 'NUMEROLOGY',
    isOpen: false,
    zIndex: 100,
    position: { x: 100, y: 100 },
    size: { width: 400, height: 300 },
    isMaximized: false,
    isMinimized: false
  },
  'guestbook': {
    id: 'guestbook',
    title: 'GUESTBOOK',
    isOpen: false,
    zIndex: 100,
    position: { x: 150, y: 150 },
    size: { width: 500, height: 400 },
    isMaximized: false,
    isMinimized: false
  },
  'window-portfolio': {
    id: 'window-portfolio',
    title: 'ARCHIVE',
    isOpen: false,
    zIndex: 100,
    position: { x: 100, y: 100 },
    size: { width: 600, height: 500 },
    isMaximized: false,
    isMinimized: false
  },
  'gifypet': {
    id: 'gifypet',
    title: 'GIFYPET',
    isOpen: false,
    zIndex: 100,
    position: { x: 200, y: 200 },
    size: { width: 400, height: 300 },
    isMaximized: false,
    isMinimized: false
  }
};

// Create the store
export const windowsStore = writable<Record<string, WindowState>>(initialWindows);
let currentZIndex = 100;

// Set up window resize handler when in browser
if (browser) {
  window.addEventListener('resize', () => {
    windowsStore.update(windows => {
      // Update positions of all open windows
      Object.keys(windows).forEach(id => {
        if (windows[id].isOpen && !windows[id].isMaximized) {
          windows[id].position = ensureWindowInView(windows[id]);
        }
      });
      return windows;
    });
  });
}

/**
 * Ensures window position is within the visible screen area
 */
function ensureWindowInView(windowState: WindowState): { x: number; y: number } {
  // Default to current position if we can't determine viewport size (SSR)
  let { x, y } = windowState.position;
  
  // Only run this in the browser, not during SSR
  if (typeof window !== 'undefined') {
    // Get viewport dimensions (account for taskbar height)
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1024;
    const viewportHeight = (window.innerHeight || document.documentElement.clientHeight || 768) - UI_DIMENSIONS.layout.taskbarHeight;
    
    // Check if we're on mobile
    const isMobile = viewportWidth <= 768;
    
    if (isMobile) {
      // On mobile, position windows to fill most of the screen
      x = 5;
      y = 10;
    } else {
      // Desktop positioning logic
      // Ensure window header is always accessible (at least 30px visible)
      const minVisibleWidth = Math.min(UI_DIMENSIONS.window.minWidth, windowState.size.width);
      const minVisibleHeight = UI_DIMENSIONS.window.headerHeight;
      
      // Calculate bounds
      const maxX = Math.max(0, viewportWidth - minVisibleWidth);
      const maxY = Math.max(0, viewportHeight - minVisibleHeight);
      
      // Adjust position if needed
      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));
    }
  }
  
  return { x, y };
}

/**
 * Get mobile-optimized window size
 */
function getMobileOptimizedSize(windowState: WindowState): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return windowState.size;
  }

  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1024;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 768;
  const isMobile = viewportWidth <= 768;
  
  if (!isMobile) {
    return windowState.size;
  }

  // Mobile size optimization
  const mobileWidth = Math.min(windowState.size.width, viewportWidth - 10);
  const mobileHeight = Math.min(windowState.size.height, viewportHeight - 80);
  
  // Ensure minimum usable size
  const finalWidth = Math.max(mobileWidth, 300);
  const finalHeight = Math.max(mobileHeight, 200);
  
  return { width: finalWidth, height: finalHeight };
}

// Window actions
export function openWindow(id: string): void {
  windowsStore.update(windows => {
    if (windows[id]) {
      currentZIndex += 1;
      
      if (browser) {
        // Get viewport dimensions
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1024;
        const viewportHeight = (window.innerHeight || document.documentElement.clientHeight || 768) - UI_DIMENSIONS.layout.taskbarHeight;
        const isMobile = viewportWidth <= 768;
        
        let position: { x: number; y: number };
        let size: { width: number; height: number };
        
        if (isMobile) {
          // Mobile positioning: center and optimize size
          size = getMobileOptimizedSize(windows[id]);
          position = {
            x: Math.max(5, (viewportWidth - size.width) / 2),
            y: Math.max(10, (viewportHeight - size.height) / 2)
          };
        } else {
          // Desktop positioning: center window in viewport if first time opening
          const centerX = Math.max(0, (viewportWidth - windows[id].size.width) / 2);
          const centerY = Math.max(0, (viewportHeight - windows[id].size.height) / 2);
          
          position = !windows[id].isOpen ? 
            { x: centerX, y: centerY } : 
            ensureWindowInView(windows[id]);
          size = windows[id].size;
        }
          
        windows[id] = {
          ...windows[id],
          isOpen: true,
          isMinimized: false,
          zIndex: currentZIndex,
          position,
          size
        };
      } else {
        // Fallback for SSR
        windows[id] = {
          ...windows[id],
          isOpen: true,
          isMinimized: false,
          zIndex: currentZIndex
        };
      }
    }
    return windows;
  });
}

export function closeWindow(id: string): void {
  windowsStore.update(windows => {
    if (windows[id]) {
      windows[id] = {
        ...windows[id],
        isOpen: false,
        isMinimized: false
      };
    }
    return windows;
  });
}

export function minimizeWindow(id: string): void {
  windowsStore.update(windows => {
    if (windows[id]) {
      windows[id] = {
        ...windows[id],
        isMinimized: true
      };
    }
    return windows;
  });
}

export function maximizeWindow(id: string): void {
  windowsStore.update(windows => {
    if (windows[id]) {
      windows[id] = {
        ...windows[id],
        isMaximized: !windows[id].isMaximized
      };
    }
    return windows;
  });
}

export function focusWindow(id: string): void {
  windowsStore.update(windows => {
    if (windows[id] && windows[id].isOpen) {
      currentZIndex += 1;
      windows[id] = {
        ...windows[id],
        zIndex: currentZIndex,
        isMinimized: false
      };
    }
    return windows;
  });
}

export function moveWindow(id: string, x: number, y: number): void {
  windowsStore.update(windows => {
    if (windows[id]) {
      windows[id] = {
        ...windows[id],
        position: { x, y }
      };
    }
    return windows;
  });
}

export function resizeWindow(id: string, width: number, height: number): void {
  windowsStore.update(windows => {
    if (windows[id]) {
      windows[id] = {
        ...windows[id],
        size: { width, height }
      };
    }
    return windows;
  });
} 