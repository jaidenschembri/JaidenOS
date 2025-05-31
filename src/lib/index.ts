// Re-export types
export * from './types';

// Re-export store actions
export { 
  // Window actions
  openWindow,
  closeWindow,
  minimizeWindow,
  maximizeWindow,
  focusWindow,
  moveWindow,
  resizeWindow,
  windowsStore
} from './stores/windows';

export {
  // Icon actions
  positionIcons,
  updateIconState,
  updateIconPosition,
  iconsStore
} from './stores/icons';

// Export components
export { default as DraggableIcon } from './components/DraggableIcon.svelte';
export { default as WindowWrapper } from './components/WindowWrapper.svelte';
export { default as Taskbar } from './components/Taskbar.svelte';
export { default as StartMenu } from './components/StartMenu.svelte'; 