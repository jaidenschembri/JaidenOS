<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { WindowsSounds } from '$lib/utils';
  
  const dispatch = createEventDispatcher();
  let backgroundSubmenuVisible = false;
  let backgroundSubmenuTimeout: ReturnType<typeof setTimeout> | null = null;
  let submenuElement: HTMLElement | null = null;
  let submenuParentElement: HTMLElement | null = null;

  // Background options (same as DesktopContextMenu)
  const backgrounds = [
    // Custom local backgrounds:
    {
      name: 'Custom Photo',
      url: '/backgrounds/DSC00330-Edit-59391339deded__880.jpg'
    },
    {
      name: 'Mystic 2',
      url: '/backgrounds/wallhaven-zywe5j.jpg'
    },
    {
      name: 'Mystic 1',
      url: '/backgrounds/wallhaven-zywwky.jpg'
    },
    {
      name: 'Default',
      url: 'none',
    },
    {
      name: 'Black Hole',
      url: '/backgrounds/solar-eclipse.jpg'
    }
  ];

  function changeBackground(backgroundUrl: string): void {
    WindowsSounds.playClickSound();
    
    // Detect if we're on mobile (specifically iOS Safari)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    if (backgroundUrl === 'none') {
      // Restore default gradient pattern
      document.body.style.backgroundImage = `
        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 2px, transparent 2px),
        radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 2px, transparent 2px),
        linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%)
      `;
      document.body.style.backgroundSize = '40px 40px, 40px 40px, 20px 20px, 20px 20px';
      document.body.style.backgroundPosition = '0 0, 20px 20px, 0 0, 10px 10px';
      document.body.style.backgroundAttachment = 'scroll';
    } else {
      // Apply new background image
      document.body.style.backgroundImage = `url("${backgroundUrl}")`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      // Use 'scroll' on mobile devices to avoid Safari issues, 'fixed' on desktop
      document.body.style.backgroundAttachment = isMobile ? 'scroll' : 'fixed';
    }
    
    dispatch('close');
  }

  function handleMenuClick(): void {
    WindowsSounds.playClickSound();
  }

  function showBackgroundSubmenu(): void {
    if (backgroundSubmenuTimeout) {
      clearTimeout(backgroundSubmenuTimeout);
      backgroundSubmenuTimeout = null;
    }
    backgroundSubmenuVisible = true;
    
    // Position submenu to prevent overflow
    setTimeout(() => {
      if (submenuElement && submenuParentElement) {
        const submenuRect = submenuElement.getBoundingClientRect();
        const parentRect = submenuParentElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const taskbarHeight = 40; // Height of taskbar
        const availableHeight = viewportHeight - taskbarHeight;
        
        // Check if submenu would overflow bottom of screen
        if (submenuRect.bottom > availableHeight) {
          // Calculate how much to move up
          const overflow = submenuRect.bottom - availableHeight;
          const newTop = Math.max(-parentRect.height, -2 - overflow);
          submenuElement.style.top = `${newTop}px`;
        } else {
          // Reset to default position
          submenuElement.style.top = '-2px';
        }
      }
    }, 0);
  }

  function hideBackgroundSubmenu(): void {
    backgroundSubmenuTimeout = setTimeout(() => {
      backgroundSubmenuVisible = false;
    }, 100);
  }

  function keepBackgroundSubmenuOpen(): void {
    if (backgroundSubmenuTimeout) {
      clearTimeout(backgroundSubmenuTimeout);
      backgroundSubmenuTimeout = null;
    }
  }
</script>

<div id="start-menu" class="start-menu">
  <ul>   
    <li class="menu-item" on:click={handleMenuClick}>
      Programs
      <span class="arrow">▸</span>
    </li>
    
    <li class="menu-item" on:click={handleMenuClick}>
      Documents
      <span class="arrow">▸</span>
    </li>
    
    <li class="menu-item" on:click={handleMenuClick}>
      Settings
      <span class="arrow">▸</span>
    </li>
    
    <li class="menu-item" on:click={handleMenuClick}>
      Find
      <span class="arrow">▸</span>
    </li>
    
    <li class="menu-item" on:click={handleMenuClick}>
      Help
    </li>
    
    <li class="menu-item" on:click={handleMenuClick}>
      Run...
    </li>
    
    <li class="menu-divider">
      <div class="menu-divider-line"></div>
    </li>

    <li class="submenu-parent" 
        bind:this={submenuParentElement}
        on:mouseenter={showBackgroundSubmenu} 
        on:mouseleave={hideBackgroundSubmenu}
        on:click={showBackgroundSubmenu}>
      Backgrounds ▸
      <ul class="submenu" 
          bind:this={submenuElement}
          class:visible={backgroundSubmenuVisible} 
          on:mouseenter={keepBackgroundSubmenuOpen} 
          on:mouseleave={hideBackgroundSubmenu}>
        {#each backgrounds as bg}
          <li on:click={() => changeBackground(bg.url)}>{bg.name}</li>
        {/each}
      </ul>
    </li>
    
    <li class="menu-divider">
      <div class="menu-divider-line"></div>
    </li>
    
    <li class="menu-item shutdown">
      Shut Down...
    </li>
  </ul>
</div>

<style>
  /* ===== START MENU ===== */
  .start-menu {
    position: fixed;
    bottom: 42px;
    left: 12px;
    width: 130px;
    background: #dcdcdc;
    border: 2px solid #999;
    box-shadow:
      inset -1px -1px 0 #fff,
      inset 1px 1px 0 #666,
      2px 2px 0 #444;
    font-family: 'VT323', monospace;
    font-size: 15px;
    color: #000;
    padding: 4px 0;
    z-index: 9999;
    overflow: visible !important;
  }

  .start-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .start-menu li {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 16px;
    cursor: pointer;
    transition: background 0.1s ease;
    font-size: 11px;
    line-height: 1.2;
  }

  .start-menu li:hover {
    background: #0078d4;
    color: white;
  }

  /* Menu items styling */
  .menu-item {
    position: relative;
    justify-content: space-between;
  }

  .arrow {
    font-size: 8px;
    color: #000;
  }

  .start-menu li:hover .arrow {
    color: white;
  }

  .shutdown {
    font-weight: bold;
  }

  /* Prevent hover on dividers */
  .start-menu li:has(.menu-divider-line):hover,
  .start-menu li.menu-divider:hover {
    background: transparent !important;
    cursor: default !important;
    box-shadow: none !important;
    color: #000 !important;
  }

  /* ===== SUBMENU ===== */
  .submenu-parent {
    position: relative;
    justify-content: space-between;
  }

  .submenu {
    display: none;
    position: absolute;
    top: -2px;
    left: 128px;
    background: #dcdcdc;
    border: 2px solid #808080;
    box-shadow:
      inset 1px 1px 0 #fff,
      inset -1px -1px 0 #404040,
      2px 2px 4px rgba(0, 0, 0, 0.3);
    font-family: 'VT323', monospace;
    font-size: 11px;
    color: #000;
    padding: 2px 0;
    width: 110px;
    z-index: 9999;
  }

  .submenu.visible {
    display: block;
  }

  .submenu li {
    display: flex;
    align-items: center;
    padding: 4px 16px;
    cursor: pointer;
    transition: background 0.1s ease;
    font-size: 11px;
    line-height: 1.2;
    justify-content: flex-start;
  }

  .submenu li:hover {
    background: #0078d4;
    color: white;
  }

  /* ===== MENU DIVIDERS ===== */
  .menu-divider {
    padding: 3px 0 !important;
    margin: 2px 0;
  }

  .menu-divider-line {
    width: calc(100% - 8px);
    height: 1px;
    background: #808080;
    box-shadow: 0 1px 0 #fff;
    margin: 0 4px;
    display: block;
  }
</style> 