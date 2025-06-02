<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow, resizeWindow, windowsStore } from '$lib/stores/windows';
  import { WindowsSounds } from '$lib/utils';
  import { getAssetPath } from '$lib/utils/assets';
  import type { WindowState } from '$lib/types';

  // Props
  export let windowState: WindowState;
  
  // Local state
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let windowElement: HTMLElement;
  let currentZIndex = 100; // Default z-index
  
  const dispatch = createEventDispatcher();
  
  // Subscribe to get highest z-index
  windowsStore.subscribe(windows => {
    // Find the highest z-index among all windows
    currentZIndex = Object.values(windows).reduce(
      (max, win) => win.zIndex > max ? win.zIndex : max,
      100
    );
  });
  
  function handleMouseDown(event: MouseEvent): void {
    // Only start dragging from the header
    if ((event.target as HTMLElement).closest('.window-header')) {
      isDragging = true;
      dragOffset.x = event.clientX - windowState.position.x;
      dragOffset.y = event.clientY - windowState.position.y;
      focusWindow(windowState.id);
      event.preventDefault();
    }
  }
  
  function handleMouseMove(event: MouseEvent): void {
    if (isDragging && !windowState.isMaximized) {
      const x = event.clientX - dragOffset.x;
      const y = event.clientY - dragOffset.y;
      moveWindow(windowState.id, x, y);
      event.preventDefault();
    }
  }
  
  function handleMouseUp(): void {
    isDragging = false;
  }

  // Touch event handlers for mobile
  function handleTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) return;
    
    // Only start dragging from the header
    if ((event.target as HTMLElement).closest('.window-header')) {
      isDragging = true;
      const touch = event.touches[0];
      dragOffset.x = touch.clientX - windowState.position.x;
      dragOffset.y = touch.clientY - windowState.position.y;
      focusWindow(windowState.id);
      event.preventDefault();
    }
  }
  
  function handleTouchMove(event: TouchEvent): void {
    if (isDragging && !windowState.isMaximized && event.touches.length === 1) {
      const touch = event.touches[0];
      const x = touch.clientX - dragOffset.x;
      const y = touch.clientY - dragOffset.y;
      
      // Constrain to viewport on mobile
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const constrainedX = Math.max(0, Math.min(x, viewportWidth - 100)); // Keep some window visible
      const constrainedY = Math.max(0, Math.min(y, viewportHeight - 100));
      
      moveWindow(windowState.id, constrainedX, constrainedY);
      event.preventDefault();
    }
  }
  
  function handleTouchEnd(): void {
    isDragging = false;
  }
  
  function handleClose(): void {
    WindowsSounds.playClickSound();
    closeWindow(windowState.id);
    dispatch('close', { id: windowState.id });
  }
  
  function handleMinimize(): void {
    WindowsSounds.playClickSound();
    minimizeWindow(windowState.id);
    dispatch('minimize', { id: windowState.id });
  }
  
  function handleMaximize(): void {
    WindowsSounds.playClickSound();
    maximizeWindow(windowState.id);
    dispatch('maximize', { id: windowState.id });
  }
  
  function handleWindowClick(): void {
    focusWindow(windowState.id);
  }

  // Check if we're on mobile
  function isMobileDevice(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
  }
  
  // Dispatch events when window state changes
  $: {
    if (windowState.isOpen && !windowState.isMinimized) {
      dispatch('open', { id: windowState.id });
    }
  }
  
  onMount(() => {
    // Dispatch initial open event if window is open on mount
    if (windowState.isOpen && !windowState.isMinimized) {
      dispatch('open', { id: windowState.id });
    }
    
    // Add global mouse event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Add touch event listeners for mobile
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      // Clean up listeners when component is destroyed
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  });
</script>

<div 
  class="window" 
  class:hidden={!windowState.isOpen || windowState.isMinimized}
  class:maximized={windowState.isMaximized}
  class:active-window={windowState.zIndex === currentZIndex}
  class:mobile={isMobileDevice()}
  style="
    z-index: {windowState.zIndex}; 
    {!windowState.isMaximized ? `
      top: ${windowState.position.y}px; 
      left: ${windowState.position.x}px;
      width: ${windowState.size.width}px; 
      height: ${windowState.size.height}px;
    ` : ''}
  "
  bind:this={windowElement}
  on:mousedown={handleMouseDown}
  on:touchstart={handleTouchStart}
  on:click={handleWindowClick}
>
  <div class="window-header">
    {windowState.title}
    <div class="window-controls">
      <button class="minimize-btn" on:click|stopPropagation={handleMinimize} title="Minimize">
        <img src={getAssetPath('/icons/minimize-icon.svg')} alt="Minimize" />
      </button>

      <button class="close-btn" on:click|stopPropagation={handleClose} title="Close">
        <img src={getAssetPath('/icons/close-icon.svg')} alt="Close" />
      </button>
    </div>
  </div>
  <div class="window-content">
    <slot></slot>
  </div>
</div>

<style>
  .window {
    position: absolute;
    background-color: #c0c0c0;
    border: 2px solid #000;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
    resize: both;
    overflow: hidden;
  }

  .window.maximized {
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 40px); /* Adjust for taskbar */
    resize: none;
  }
  
  .window.active-window {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
  }

  .window-header {
    background-color: #000080;
    color: white;
    padding: 5px 10px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
    user-select: none;
  }
  
  .active-window .window-header {
    background-color: #1084d0;
  }

  .window-controls {
    display: flex;
    gap: 2px;
  }

  .window-controls button {
    width: 16px;
    height: 14px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: filter 0.1s ease;
  }

  .window-controls button:hover {
    filter: brightness(1.1);
  }

  .window-controls button:active {
    filter: brightness(0.9);
  }

  .window-controls button img {
    width: 16px;
    height: 14px;
    display: block;
  }

  .window-content {
    padding: 10px;
    height: calc(100% - 30px);
    overflow: auto;
    position: relative;
  }

  /* ===== MOBILE WINDOW STYLES ===== */
  @media (max-width: 768px) {
    .window.mobile {
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      min-width: calc(100vw - 20px) !important;
      max-width: calc(100vw - 10px) !important;
      min-height: 200px;
      max-height: calc(100vh - 80px) !important;
    }

    .window.mobile.maximized {
      border-radius: 0;
      box-shadow: none;
    }

    .window.mobile .window-content {
      padding: 16px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    /* Improve scrollbar for mobile */
    .window.mobile .window-content::-webkit-scrollbar {
      width: 8px;
    }

    .window.mobile .window-content::-webkit-scrollbar-track {
      background: rgba(192, 192, 192, 0.3);
    }

    .window.mobile .window-content::-webkit-scrollbar-thumb {
      background: rgba(136, 136, 136, 0.6);
      border-radius: 4px;
    }
  }

  /* Mobile landscape adjustments */
  @media (max-width: 768px) and (orientation: landscape) {
    .window.mobile {
      max-height: calc(100vh - 60px) !important;
    }

    .window.mobile .window-content {
      padding: 12px;
    }
  }

  /* Tablet adjustments */
  @media (min-width: 769px) and (max-width: 1024px) {
    .window {
      border-radius: 6px;
    }

    .window .window-header {
      border-radius: 6px 6px 0 0;
    }

    .window.maximized {
      border-radius: 0;
    }

    .window.maximized .window-header {
      border-radius: 0;
    }
  }
</style> 