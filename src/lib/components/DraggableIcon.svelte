<script lang="ts">
  import { onMount } from 'svelte';
  import { openWindow } from '$lib/stores/windows';
  import { updateIconPosition } from '$lib/stores/icons';
  import { UI_DIMENSIONS } from '$lib/types';
  
  export let id: string;
  export let icon: string;
  export let title: string;
  export let position: { x: number; y: number } = { x: 0, y: 0 };
  export let isOpen: boolean = false;
  export let openIcon: string | undefined = undefined;
  
  let iconElement: HTMLElement;
  let isDragging = false;
  let isSelected = false;
  let startX: number, startY: number, startPosX: number, startPosY: number;
  
  // Handle mouse down event
  function handleMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return; // Only respond to left mouse button
    e.preventDefault();
    e.stopPropagation();
    
    // Mark as selected on mousedown
    isSelected = true;
    
    // Get initial positions
    startX = e.clientX;
    startY = e.clientY;
    
    // Get initial element position
    if (iconElement) {
      const rect = iconElement.getBoundingClientRect();
      startPosX = rect.left;
      startPosY = rect.top;
      
      // Make sure the element is absolutely positioned
      iconElement.style.position = 'absolute';
      
      // Add move and up listeners to document
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }
  
  // Handle touch start for mobile devices
  function handleTouchStart(e: TouchEvent): void {
    if (e.touches.length !== 1) return; // Only handle single touch
    e.preventDefault();
    e.stopPropagation();
    
    // Mark as selected
    isSelected = true;
    
    // Get initial positions
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    
    // Get initial element position
    if (iconElement) {
      const rect = iconElement.getBoundingClientRect();
      startPosX = rect.left;
      startPosY = rect.top;
      
      // Make sure the element is absolutely positioned
      iconElement.style.position = 'absolute';
      
      // Add touch move and end listeners
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
  }
  
  function handleMouseMove(e: MouseEvent): void {
    if (!iconElement) return;
    
    // Calculate movement delta
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    // If we've moved beyond a small threshold, consider it dragging
    if (!isDragging && (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3)) {
      isDragging = true;
      // When dragging starts, bring to front
      iconElement.style.zIndex = '999';
    }
    
    if (isDragging) {
      // Use transform for smoother dragging performance
      iconElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }
  }
  
  function handleTouchMove(e: TouchEvent): void {
    if (!iconElement || e.touches.length !== 1) return;
    e.preventDefault(); // Prevent scrolling while dragging on touch devices
    
    // Calculate movement delta
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;
    
    // If we've moved beyond a small threshold, consider it dragging
    if (!isDragging && (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3)) {
      isDragging = true;
      // When dragging starts, bring to front
      iconElement.style.zIndex = '999';
    }
    
    if (isDragging) {
      // Use transform for smoother dragging performance
      iconElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }
  }
  
  function handleMouseUp(e: MouseEvent): void {
    // Clean up event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    if (!iconElement) return;
    
    // If this was a click (not a drag), open the window
    if (!isDragging) {
      openWindow(id);
    }
    
    if (isDragging) {
      // Calculate the final position based on the delta
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      let newX = startPosX + deltaX;
      let newY = startPosY + deltaY;
      
      // Constrain to screen boundaries
      const { padding } = UI_DIMENSIONS.layout.iconGrid;
      const { width, height } = UI_DIMENSIONS.icon;
      const { taskbarHeight } = UI_DIMENSIONS.layout;
      
      newX = Math.max(padding, Math.min(newX, window.innerWidth - width - padding));
      newY = Math.max(padding, Math.min(newY, window.innerHeight - height - taskbarHeight));
      
      // Reset transform and set the final position
      iconElement.style.transform = '';
      iconElement.style.left = `${newX}px`;
      iconElement.style.top = `${newY}px`;
      
      const newPosition = { x: newX, y: newY };
      position = newPosition;
      
      // Update the icon position in the store
      updateIconPosition(id, newPosition);
    }
    
    // Reset dragging state
    isDragging = false;
    iconElement.style.zIndex = '50';
    
    // Only add the event listener if the component is still mounted
    if (iconElement) {
      // On mouseup, check if clicked outside any icon to deselect
      document.addEventListener('click', handleOutsideClick, { once: true });
    }
  }
  
  function handleTouchEnd(e: TouchEvent): void {
    // Clean up event listeners
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    
    if (!iconElement) return;
    
    // If this was a tap (not a drag), open the window
    if (!isDragging) {
      openWindow(id);
    }
    
    if (isDragging) {
      // Calculate the final position based on the delta
      const deltaX = e.changedTouches[0].clientX - startX;
      const deltaY = e.changedTouches[0].clientY - startY;
      let newX = startPosX + deltaX;
      let newY = startPosY + deltaY;
      
      // Constrain to screen boundaries
      const { padding } = UI_DIMENSIONS.layout.iconGrid;
      const { width, height } = UI_DIMENSIONS.icon;
      const { taskbarHeight } = UI_DIMENSIONS.layout;
      
      newX = Math.max(padding, Math.min(newX, window.innerWidth - width - padding));
      newY = Math.max(padding, Math.min(newY, window.innerHeight - height - taskbarHeight));
      
      // Reset transform and set the final position
      iconElement.style.transform = '';
      iconElement.style.left = `${newX}px`;
      iconElement.style.top = `${newY}px`;
      
      const newPosition = { x: newX, y: newY };
      position = newPosition;
      
      // Update the icon position in the store
      updateIconPosition(id, newPosition);
    }
    
    // Reset dragging state
    isDragging = false;
    iconElement.style.zIndex = '50';
  }
  
  function handleOutsideClick(e: MouseEvent): void {
    // Check if iconElement exists and if click was outside this icon, deselect
    if (iconElement && !iconElement.contains(e.target as Node)) {
      isSelected = false;
    }
  }
  
  // Handle double-click to open window
  function handleDoubleClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    openWindow(id);
  }
  
  onMount(() => {
    if (iconElement) {
      // Ensure absolute positioning is set at mount time
      iconElement.style.position = 'absolute';
      iconElement.style.left = `${position.x}px`;
      iconElement.style.top = `${position.y}px`;
      
      // Function for handling outside clicks in the mousedown event
      const handleGlobalMouseDown = (e: MouseEvent) => {
        if (iconElement && !iconElement.contains(e.target as Node)) {
          isSelected = false;
        }
      };
      
      // Listen for clicks outside to deselect
      document.addEventListener('mousedown', handleGlobalMouseDown);
      
      // Handle window resize to ensure icons stay in bounds
      const handleResize = () => {
        const { padding } = UI_DIMENSIONS.layout.iconGrid;
        const { width, height } = UI_DIMENSIONS.icon;
        const { taskbarHeight } = UI_DIMENSIONS.layout;
        
        if (position.x > window.innerWidth - width - padding ||
            position.y > window.innerHeight - height - taskbarHeight) {
          // If out of bounds after resize, update position
          const newX = Math.min(position.x, window.innerWidth - width - padding);
          const newY = Math.min(position.y, window.innerHeight - height - taskbarHeight);
          position = { x: newX, y: newY };
          updateIconPosition(id, position);
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        // Clean up all event listeners
        document.removeEventListener('mousedown', handleGlobalMouseDown);
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('resize', handleResize);
      };
    }
  });
  
  // Update position when prop changes
  $: if (iconElement && position) {
    iconElement.style.position = 'absolute';
    iconElement.style.left = `${position.x}px`;
    iconElement.style.top = `${position.y}px`;
  }
  
  // Use the open icon if available and window is open
  $: currentIcon = isOpen && openIcon ? openIcon : icon;
</script>

<div 
  class="icon" 
  class:selected={isSelected}
  class:open={isOpen}
  bind:this={iconElement}
  on:mousedown={handleMouseDown}
  on:touchstart={handleTouchStart}
  on:dblclick={handleDoubleClick}
  data-window-id={id}
>
  <div class="icon-image">
    <img src={currentIcon} alt={title}>
  </div>
  <div class="icon-title">
    <span>{title}</span>
  </div>
</div>

<style>
  .icon {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100px;
    height: 100px;
    user-select: none;
    cursor: pointer;
    transition: filter 0.1s ease;
    z-index: 50;
    touch-action: none; /* Prevent scrolling when dragging on touch devices */
  }
  
  .icon.selected .icon-title {
    background-color: rgba(0, 0, 128, 0.7);
    color: white;
  }
  
  .icon.open {
    filter: brightness(1.2);
  }
  
  .icon-image {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }
  
  .icon-image img {
    width: 64px;
    height: 64px;
    object-fit: contain;
  }
  
  .icon-title {
    padding: 2px 4px;
    border-radius: 2px;
    max-width: 100%;
    width: 100%;
  }
  
  .icon-title span {
    color: white;
    text-shadow: 1px 1px 2px black;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
</style> 