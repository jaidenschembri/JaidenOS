import { writable } from 'svelte/store';
import type { IconState } from '$lib/types';
import { UI_DIMENSIONS } from '$lib/types';
import { getAssetPath } from '$lib/utils/assets';

// Configuration for icons
const APPS_CONFIG = {
  // Application Icons
  chatbot: { 
    title: 'Chatbot', 
    icon: getAssetPath('/icons/folder-icon.png'), 
    openIcon: getAssetPath('/icons/folder-icon-open.png') 
  },
  oscillator: { 
    title: 'Oscillator', 
    icon: getAssetPath('/icons/folder-icon.png'), 
    openIcon: getAssetPath('/icons/folder-icon-open.png') 
  },
  numerology: { 
    title: 'Numerology', 
    icon: getAssetPath('/icons/folder-icon.png'), 
    openIcon: getAssetPath('/icons/folder-icon-open.png') 
  },
  guestbook: { 
    title: 'Guestbook', 
    icon: getAssetPath('/icons/folder-icon.png'), 
    openIcon: getAssetPath('/icons/folder-icon-open.png') 
  },
  'window-portfolio': { 
    title: 'Portfolio', 
    icon: getAssetPath('/icons/folder-icon.png'), 
    openIcon: getAssetPath('/icons/folder-icon-open.png') 
  },
  'physics-game': { 
    title: 'Physics', 
    icon: getAssetPath('/icons/folder-icon.png'), 
    openIcon: getAssetPath('/icons/folder-icon-open.png') 
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
    // Detect if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    // Use mobile-specific dimensions if on mobile
    const iconWidth = isMobile ? 110 : UI_DIMENSIONS.layout.iconGrid.width;
    const iconHeight = isMobile ? 110 : UI_DIMENSIONS.layout.iconGrid.height;
    const padding = isMobile ? 10 : UI_DIMENSIONS.layout.iconGrid.padding;
    
    const { taskbarHeight } = UI_DIMENSIONS.layout;
    
    const availableWidth = window.innerWidth - padding * 2;
    const availableHeight = window.innerHeight - taskbarHeight - padding * 2;
    
    // Calculate how many icons can fit vertically in one column
    const iconsPerColumn = Math.floor(availableHeight / iconHeight);
    
    // Calculate how many columns we can fit
    const maxColumns = Math.floor(availableWidth / iconWidth);
    
    // Ensure we have at least one column and one row
    const safeIconsPerColumn = Math.max(1, iconsPerColumn);
    const safeMaxColumns = Math.max(1, maxColumns);
    
    // Position each icon in a grid
    Object.entries(icons).forEach(([id, icon], index) => {
      // Calculate column and row for this icon
      const column = Math.floor(index / safeIconsPerColumn);
      const row = index % safeIconsPerColumn;
      
      // Skip positioning if we exceed available columns
      if (column >= safeMaxColumns) {
        return;
      }
      
      // Calculate x and y positions
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