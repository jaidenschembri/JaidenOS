<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow, resizeWindow, windowsStore } from '$lib/stores/windows';
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
  
  function handleClose(): void {
    closeWindow(windowState.id);
    dispatch('close', { id: windowState.id });
  }
  
  function handleMinimize(): void {
    minimizeWindow(windowState.id);
    dispatch('minimize', { id: windowState.id });
  }
  
  function handleMaximize(): void {
    maximizeWindow(windowState.id);
    dispatch('maximize', { id: windowState.id });
  }
  
  function handleWindowClick(): void {
    focusWindow(windowState.id);
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
    
    return () => {
      // Clean up listeners when component is destroyed
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });
</script>

<div 
  class="window" 
  class:hidden={!windowState.isOpen || windowState.isMinimized}
  class:maximized={windowState.isMaximized}
  class:active-window={windowState.zIndex === currentZIndex}
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
  on:click={handleWindowClick}
>
  <div class="window-header">
    {windowState.title}
    <div class="window-controls">
      <button class="minimize-btn" on:click|stopPropagation={handleMinimize} title="Minimize">
        <img src="/icons/minimize-icon.svg" alt="Minimize" />
      </button>

      <button class="close-btn" on:click|stopPropagation={handleClose} title="Close">
        <img src="/icons/close-icon.svg" alt="Close" />
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
  }

  .window-controls button {
    background: none;
    border: none;
    cursor: pointer;
    color: white;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
  }

  .window-controls button img {
    width: 16px;
    height: 16px;
  }

  .window-content {
    padding: 10px;
    height: calc(100% - 30px);
    overflow: auto;
    position: relative;
  }
</style> 