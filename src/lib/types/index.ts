// Common types used across the application

// Window related types
export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMaximized: boolean;
  isMinimized: boolean;
}

// Icon related types
export interface IconState {
  id: string;
  title: string;
  icon: string;
  openIcon?: string;
  position: { x: number; y: number };
  isOpen: boolean;
}

// UI Configuration
export const UI_DIMENSIONS = {
  // Icon dimensions
  icon: {
    width: 130,  // Width of icon element
    height: 130, // Height of icon element
  },
  
  // Layout configuration
  layout: {
    iconGrid: {
      width: 140,    // Width of each icon slot including spacing (reduced for better mobile fit)
      height: 140,   // Height of each icon slot including spacing (reduced for better mobile fit)
      padding: 15,   // Padding from screen edges (reduced for mobile)
    },
    taskbarHeight: 40 // Height of taskbar
  },
  
  // Window dimensions
  window: {
    minWidth: 300,
    minHeight: 200,
    headerHeight: 30,
    defaultWidth: 500,
    defaultHeight: 400
  }
}; 