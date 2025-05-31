import { writable } from 'svelte/store';
import type { IconState } from '$lib/types';
import { UI_DIMENSIONS } from '$lib/types';

// Configuration for icons
const APPS_CONFIG = {
  chatbot: { 
    title: 'Chatbot', 
    icon: '/icons/folder-icon.png', 
    openIcon: '/icons/folder-icon-open.png' 
  },
  oscillator: { 
    title: 'Oscillator', 
    icon: '/icons/folder-icon.png', 
    openIcon: '/icons/folder-icon-open.png' 
  },
  numerology: { 
    title: 'Numerology', 
    icon: '/icons/folder-icon.png', 
    openIcon: '/icons/folder-icon-open.png' 
  },
  guestbook: { 
    title: 'Guestbook', 
    icon: '/icons/folder-icon.png', 
    openIcon: '/icons/folder-icon-open.png' 
  },
  'window-shop': { 
    title: 'Shop', 
    icon: '/icons/folder-icon.png', 
    openIcon: '/icons/folder-icon-open.png' 
  },
  'window-portfolio': { 
    title: 'Portfolio', 
    icon: '/icons/folder-icon.png', 
    openIcon: '/icons/folder-icon-open.png' 
  },
};

// Initial icons state
const initialIcons: Record<string, IconState> = Object.entries(APPS_CONFIG).reduce((acc, [id, config]) => {
  acc[id] = {
    id,
    title: config.title,
    icon: config.icon,
    openIcon: config.openIcon,
    position: { x: 0, y: 0 },
    isOpen: false
  };
  return acc;
}, {} as Record<string, IconState>);

// Create the store
export const iconsStore = writable<Record<string, IconState>>(initialIcons);

// Function to position icons in a grid layout
export function positionIcons(): void {
  iconsStore.update(icons => {
    // Calculate available space
    const { width: iconWidth, height: iconHeight } = UI_DIMENSIONS.layout.iconGrid;
    const { padding } = UI_DIMENSIONS.layout.iconGrid;
    const { taskbarHeight } = UI_DIMENSIONS.layout;
    
    const availableHeight = window.innerHeight - taskbarHeight - padding * 2;
    const availableWidth = window.innerWidth - padding * 2;
    
    // Number of icons per column
    const iconsPerColumn = Math.floor(availableHeight / iconHeight);
    if (iconsPerColumn <= 0) return icons; // Safety check
    
    // Position each icon in the grid
    Object.entries(icons).forEach(([id, icon], index) => {
      const column = Math.floor(index / iconsPerColumn);
      const row = index % iconsPerColumn;
      
      // Ensure icons don't exceed screen width
      if (column * iconWidth + padding > availableWidth) {
        return icons; // Stop positioning if we exceed screen width
      }
      
      const x = padding + column * iconWidth;
      const y = padding + row * iconHeight;
      
      // Only update position if it's changed or not set
      if (icon.position.x !== x || icon.position.y !== y) {
        icons[id] = {
          ...icon,
          position: { x, y }
        };
      }
    });
    
    return icons;
  });
}

// Function to update icon state when window opens/closes
export function updateIconState(id: string, isOpen: boolean): void {
  iconsStore.update(icons => {
    if (icons[id]) {
      icons[id] = {
        ...icons[id],
        isOpen
      };
    }
    return icons;
  });
}

// Function to update an icon's position
export function updateIconPosition(id: string, position: { x: number; y: number }): void {
  iconsStore.update(icons => {
    if (icons[id]) {
      icons[id] = {
        ...icons[id],
        position
      };
    }
    return icons;
  });
} 