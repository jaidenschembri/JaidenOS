<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let x: number;
  export let y: number;
  
  const dispatch = createEventDispatcher();
  
  function handleRefresh(): void {
    // Refresh desktop (could reload icons or update display)
    window.location.reload();
    dispatch('hide');
  }
  
  function handleProperties(): void {
    // Show desktop properties (placeholder)
    alert('Desktop Properties - Coming Soon!');
    dispatch('hide');
  }
  
  function handleNewFolder(): void {
    // Create new folder (placeholder)
    alert('New Folder - Coming Soon!');
    dispatch('hide');
  }
  
  function handleArrangeIcons(): void {
    // Arrange icons (placeholder)
    alert('Arrange Icons - Coming Soon!');
    dispatch('hide');
  }
</script>

<div 
  class="desktop-context-menu" 
  style="left: {x}px; top: {y}px;"
>
  <ul>
    <li on:click={handleArrangeIcons}>
      <span>📋</span>
      Arrange Icons
    </li>
    <li on:click={handleRefresh}>
      <span>🔄</span>
      Refresh
    </li>
    <li class="menu-divider">
      <div class="divider"></div>
    </li>
    <li on:click={handleNewFolder}>
      <span>📁</span>
      New
      <span class="arrow">▸</span>
    </li>
    <li class="menu-divider">
      <div class="divider"></div>
    </li>
    <li on:click={handleProperties}>
      <span>⚙️</span>
      Properties
    </li>
  </ul>
</div>

<style>
  .desktop-context-menu {
    position: fixed;
    background: #c0c0c0;
    border: 2px solid #808080;
    box-shadow: 
      inset 1px 1px 0 #fff,
      inset -1px -1px 0 #404040,
      2px 2px 4px rgba(0, 0, 0, 0.3);
    font-family: 'VT323', monospace;
    font-size: 14px;
    color: #000;
    z-index: 10000;
    min-width: 140px;
  }
  
  .desktop-context-menu ul {
    list-style: none;
    margin: 0;
    padding: 2px 0;
  }
  
  .desktop-context-menu li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 16px 4px 8px;
    cursor: pointer;
    transition: background 0.1s ease;
    position: relative;
  }
  
  .desktop-context-menu li:hover:not(.menu-divider) {
    background: #0078d4;
    color: white;
  }
  
  .desktop-context-menu li span:first-child {
    width: 16px;
    font-size: 12px;
    text-align: center;
  }
  
  .arrow {
    margin-left: auto;
    font-size: 10px;
  }
  
  .menu-divider {
    padding: 2px 0 !important;
    cursor: default !important;
  }
  
  .menu-divider:hover {
    background: transparent !important;
  }
  
  .divider {
    height: 1px;
    background: #808080;
    margin: 0 4px;
    box-shadow: 0 1px 0 #fff;
  }
</style> 