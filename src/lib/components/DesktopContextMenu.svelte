<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { WindowsSounds } from '$lib/utils';
  import { getAssetPath } from '$lib/utils/assets';
  
  const dispatch = createEventDispatcher();
  
  export let x: number;
  export let y: number;
  
  let showBackgroundSubmenu = false;
  let submenuTimeout: ReturnType<typeof setTimeout> | null = null;
  
  // Predefined background images
  const backgrounds = [
    {
      name: 'Default 1',
      url: getAssetPath('/backgrounds/swag.jpg')
    },
    {
      name: 'Default 2',
      url: getAssetPath('/backgrounds/windows.jpg')
    },
    {
      name: 'Mystic 1',
      url: getAssetPath('/backgrounds/wallhaven-zywwky.jpg')
    },
    {
      name: 'Mystic 2',
      url: getAssetPath('/backgrounds/wallhaven-zywe5j.jpg')
    },
    {
      name: 'Black Hole',
      url: getAssetPath('/backgrounds/solar-eclipse.jpg')
    }
  ];
  
  function handleRefresh(): void {
    WindowsSounds.playClickSound();
    location.reload();
    dispatch('hide');
  }
  
  function handleProperties(): void {
    WindowsSounds.playClickSound();
    alert('Desktop Properties - Coming Soon!');
    dispatch('hide');
  }
  
  function changeBackground(backgroundUrl: string): void {
    WindowsSounds.playClickSound();
    
    // Detect if we're on mobile (specifically iOS Safari)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    // Apply new background image
    document.body.style.backgroundImage = `url("${backgroundUrl}")`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    // Use 'scroll' on mobile devices to avoid Safari issues, 'fixed' on desktop
    document.body.style.backgroundAttachment = isMobile ? 'scroll' : 'fixed';
    
    dispatch('hide');
  }
  
  function showSubmenu(): void {
    if (submenuTimeout) {
      clearTimeout(submenuTimeout);
      submenuTimeout = null;
    }
    showBackgroundSubmenu = true;
  }
  
  function hideSubmenu(): void {
    submenuTimeout = setTimeout(() => {
      showBackgroundSubmenu = false;
    }, 100);
  }
  
  function keepSubmenuOpen(): void {
    if (submenuTimeout) {
      clearTimeout(submenuTimeout);
      submenuTimeout = null;
    }
  }
</script>

<div class="desktop-context-menu" style="left: {x}px; top: {y}px;">
  <ul>
    <li on:click={handleRefresh}>
      Refresh
    </li>
    
    <li class="menu-divider">
      <div class="divider"></div>
    </li>
    
    <li class="submenu-parent" on:mouseenter={showSubmenu} on:mouseleave={hideSubmenu}>
      Change Background
      <span class="arrow">▸</span>
      
      {#if showBackgroundSubmenu}
        <ul class="submenu" on:mouseenter={keepSubmenuOpen} on:mouseleave={hideSubmenu}>
          {#each backgrounds as bg}
            <li on:click={() => changeBackground(bg.url)}>
              {bg.name}
            </li>
          {/each}
        </ul>
      {/if}
    </li>
    
    <li class="menu-divider">
      <div class="divider"></div>
    </li>
    
    <li on:click={handleProperties}>
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
  
  /* Submenu styles */
  .submenu-parent {
    position: relative;
  }
  
  .submenu {
    position: absolute;
    left: 100%;
    top: 0;
    background: #c0c0c0;
    border: 2px solid #808080;
    box-shadow: 
      inset 1px 1px 0 #fff,
      inset -1px -1px 0 #404040,
      2px 2px 4px rgba(0, 0, 0, 0.3);
    min-width: 120px;
    z-index: 10001;
  }
  
  .submenu li {
    display: flex;
    align-items: center;
    padding: 4px 12px;
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.1s ease, color 0.1s ease;
    color: #000;
    gap: 0;
  }
  
  .submenu li:hover {
    background: #0078d4;
    color: white;
  }
</style> 