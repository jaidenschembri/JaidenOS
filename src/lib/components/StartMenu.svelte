<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { WindowsSounds } from '$lib/utils';
  
  const dispatch = createEventDispatcher();
  let submenuVisible = false;
  let submenuTimeout: ReturnType<typeof setTimeout> | null = null;
  
  function setTheme(theme: string): void {
    WindowsSounds.playClickSound();
    document.body.className = '';
    document.body.classList.add(`${theme}-theme`);
    
    // Apply theme-specific background images
    if (theme === 'classic') {
      document.body.style.backgroundImage = 'url("https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop")';
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    } else if (theme === 'win98') {
      document.body.style.backgroundImage = 'url("https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920&h=1080&fit=crop")';
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      // Default desktop theme
      document.body.style.backgroundImage = 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop")';
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    }
    
    dispatch('close');
  }

  function handleMenuClick(): void {
    WindowsSounds.playClickSound();
  }

  function showSubmenu(): void {
    if (submenuTimeout) {
      clearTimeout(submenuTimeout);
      submenuTimeout = null;
    }
    submenuVisible = true;
  }

  function hideSubmenu(): void {
    submenuTimeout = setTimeout(() => {
      submenuVisible = false;
    }, 100); // Small delay to allow moving to submenu
  }

  function keepSubmenuOpen(): void {
    if (submenuTimeout) {
      clearTimeout(submenuTimeout);
      submenuTimeout = null;
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

    <li class="submenu-parent" on:mouseenter={showSubmenu} on:mouseleave={hideSubmenu}>
      Theme ▸
      <ul class="submenu" class:visible={submenuVisible} on:mouseenter={keepSubmenuOpen} on:mouseleave={hideSubmenu}>
        <li on:click={() => setTheme('classic')}>Windows93</li>
        <li on:click={() => setTheme('win98')}>Windows 98</li>
      </ul>
    </li>
    
    <li class="menu-divider mobile-only-divider">
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
  .start-menu li.menu-divider:hover,
  .start-menu li.mobile-only-divider:hover {
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

  /* Remove old hover-based submenu logic */
  @media (min-width: 769px) {
    .submenu-parent:hover .submenu,
    .submenu:hover {
      display: none; /* Disable CSS hover, use JS instead */
    }
    
    .submenu.visible {
      display: block !important;
    }
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

  @media (min-width: 769px) {
    .mobile-only-divider {
      display: none !important;
    }
  }
</style> 