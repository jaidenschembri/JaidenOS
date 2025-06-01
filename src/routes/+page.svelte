<script lang="ts">
  import { onMount } from 'svelte';
  import { windowsStore, openWindow, closeWindow } from '$lib/stores/windows';
  import { iconsStore, positionIcons, updateIconState } from '$lib/stores/icons';
  import { WindowsSounds } from '$lib/utils';
  import type { IconState } from '$lib/types';
  
  // Components
  import DraggableIcon from '$lib/components/DraggableIcon.svelte';
  import Ipod from '$lib/components/Ipod.svelte';
  import ChatbotWindow from '$lib/components/ChatbotWindow.svelte';
  import OscillatorWindow from '$lib/components/OscillatorWindow.svelte';
  import NumerologyWindow from '$lib/components/NumerologyWindow.svelte';
  import GuestbookWindow from '$lib/components/GuestbookWindow.svelte';
  import PortfolioWindow from '$lib/components/PortfolioWindow.svelte';
  import Taskbar from '$lib/components/Taskbar.svelte';
  import StartMenu from '$lib/components/StartMenu.svelte';
  import DesktopContextMenu from '$lib/components/DesktopContextMenu.svelte';

  let startMenuVisible = false;
  let contextMenuVisible = false;
  let contextMenuPosition = { x: 0, y: 0 };
  let icons: Record<string, IconState> = {};
  let showBootScreen = true;
  
  // Subscribe to icons store
  const unsubscribeIcons = iconsStore.subscribe(value => {
    icons = value;
  });

  function toggleStartMenu(): void {
    startMenuVisible = !startMenuVisible;
  }

  function handleDesktopRightClick(event: MouseEvent): void {
    event.preventDefault();
    contextMenuPosition = { x: event.clientX, y: event.clientY };
    contextMenuVisible = true;
    startMenuVisible = false; // Close start menu if open
  }

  function hideContextMenu(): void {
    contextMenuVisible = false;
  }

  // Connect window and icon stores
  function handleWindowOpen(id: string): void {
    updateIconState(id, true);
  }

  function handleWindowClose(id: string): void {
    updateIconState(id, false);
  }

  // Subscribe to window changes to update icons
  $: {
    if ($windowsStore) {
      Object.entries($windowsStore).forEach(([id, windowState]) => {
        if (windowState.isOpen) {
          updateIconState(id, true);
        } else {
          updateIconState(id, false);
        }
      });
    }
  }

  onMount(() => {
    // Show boot screen for 2 seconds, then play startup sound
    setTimeout(() => {
      showBootScreen = false;
      WindowsSounds.playStartupSound();
    }, 2000);

    // Position icons on desktop
    positionIcons();
    
    // Reposition icons on window resize
    window.addEventListener('resize', () => {
      positionIcons();
    });
    
    // Hide start menu when clicking outside
    document.addEventListener('click', (e) => {
      if (startMenuVisible && 
          !(e.target as HTMLElement).closest('#start-menu') && 
          !(e.target as HTMLElement).closest('#start-btn')) {
        startMenuVisible = false;
      }
      
      // Hide context menu when clicking anywhere
      if (contextMenuVisible && 
          !(e.target as HTMLElement).closest('.desktop-context-menu')) {
        hideContextMenu();
      }
    });
    
    return () => {
      window.removeEventListener('resize', positionIcons);
      unsubscribeIcons();
    };
  });
</script>

<!-- Boot Screen -->
{#if showBootScreen}
  <div class="boot-screen">
    <div class="boot-content">
      <div class="windows-logo">
        <div class="logo-square red"></div>
        <div class="logo-square green"></div>
        <div class="logo-square blue"></div>
        <div class="logo-square yellow"></div>
      </div>
      <h1 class="boot-title">Windows 95</h1>
      <div class="boot-loading">
        <div class="loading-bar">
          <div class="loading-progress"></div>
        </div>
        <p>Starting Windows...</p>
      </div>
    </div>
  </div>
{/if}

<!-- Desktop Icons -->
<div class="desktop-icons">
  {#each Object.values(icons) as icon (icon.id)}
    <DraggableIcon
      id={icon.id}
      icon={icon.icon}
      title={icon.title}
      position={icon.position}
      isOpen={icon.isOpen}
      openIcon={icon.openIcon}
    />
  {/each}
</div>

<!-- Desktop Background (for right-click context menu) -->
<div class="desktop-background" on:contextmenu={handleDesktopRightClick}></div>

<!-- iPod -->
<Ipod />

<!-- Windows -->
<ChatbotWindow on:open={() => handleWindowOpen('chatbot')} on:close={() => handleWindowClose('chatbot')} />
<OscillatorWindow on:open={() => handleWindowOpen('oscillator')} on:close={() => handleWindowClose('oscillator')} />
<NumerologyWindow on:open={() => handleWindowOpen('numerology')} on:close={() => handleWindowClose('numerology')} />
<GuestbookWindow on:open={() => handleWindowOpen('guestbook')} on:close={() => handleWindowClose('guestbook')} />
<PortfolioWindow on:open={() => handleWindowOpen('window-portfolio')} on:close={() => handleWindowClose('window-portfolio')} />

<!-- Taskbar -->
<Taskbar on:toggleStartMenu={toggleStartMenu} startMenuOpen={startMenuVisible} />

<!-- Start Menu -->
{#if startMenuVisible}
  <StartMenu on:close={() => startMenuVisible = false} />
{/if}

<!-- Desktop Context Menu -->
{#if contextMenuVisible}
  <DesktopContextMenu
    x={contextMenuPosition.x}
    y={contextMenuPosition.y}
    on:hide={hideContextMenu}
  />
{/if}

<style>
  /* Boot Screen */
  .boot-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeOut 0.5s ease-in-out 1.5s forwards;
  }

  .boot-content {
    text-align: center;
    color: #fff;
    font-family: 'VT323', monospace;
  }

  .windows-logo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    animation: logoSpin 2s ease-in-out infinite;
  }

  .logo-square {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }

  .logo-square.red { background: #ff0000; }
  .logo-square.green { background: #00ff00; }
  .logo-square.blue { background: #0000ff; }
  .logo-square.yellow { background: #ffff00; }

  .boot-title {
    font-size: 32px;
    margin: 20px 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }

  .boot-loading {
    margin-top: 30px;
  }

  .loading-bar {
    width: 200px;
    height: 20px;
    background: #333;
    border: 2px solid #666;
    margin: 0 auto 10px;
    overflow: hidden;
  }

  .loading-progress {
    height: 100%;
    background: linear-gradient(90deg, #0080ff, #00ff80);
    width: 0%;
    animation: loadingProgress 2s ease-in-out forwards;
  }

  @keyframes logoSpin {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(180deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes loadingProgress {
    0% { width: 0%; }
    100% { width: 100%; }
  }

  @keyframes fadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; display: none; }
  }

  /* Desktop icons */
  .desktop-icons {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh - 40px); /* Adjust for taskbar */
    z-index: 10;
    pointer-events: none; /* Allow clicks to pass through to desktop */
    overflow: visible; /* Allow icons to be dragged outside the container */
  }
  
  .desktop-icons :global(.icon) {
    pointer-events: auto; /* Re-enable pointer events on icons */
  }
  
  /* Desktop background for context menu */
  .desktop-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh - 40px);
    z-index: 1;
    background-image: 
      radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0);
    background-size: 20px 20px;
    background-color: inherit;
  }
</style>

