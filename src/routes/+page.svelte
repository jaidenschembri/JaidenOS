<script lang="ts">
  import { onMount } from 'svelte';
  import { windowsStore, openWindow, closeWindow } from '$lib/stores/windows';
  import { iconsStore, positionIcons, updateIconState } from '$lib/stores/icons';
  import type { IconState } from '$lib/types';
  
  // Components
  import DraggableIcon from '$lib/components/DraggableIcon.svelte';
  import Ipod from '$lib/components/Ipod.svelte';
  import ChatbotWindow from '$lib/components/ChatbotWindow.svelte';
  import OscillatorWindow from '$lib/components/OscillatorWindow.svelte';
  import NumerologyWindow from '$lib/components/NumerologyWindow.svelte';
  import GuestbookWindow from '$lib/components/GuestbookWindow.svelte';
  import PortfolioWindow from '$lib/components/PortfolioWindow.svelte';
  import ShopWindow from '$lib/components/ShopWindow.svelte';
  import Taskbar from '$lib/components/Taskbar.svelte';
  import StartMenu from '$lib/components/StartMenu.svelte';

  let startMenuVisible = false;
  let icons: Record<string, IconState> = {};
  
  // Subscribe to icons store
  const unsubscribeIcons = iconsStore.subscribe(value => {
    icons = value;
  });

  function toggleStartMenu(): void {
    startMenuVisible = !startMenuVisible;
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
    });
    
    return () => {
      window.removeEventListener('resize', positionIcons);
      unsubscribeIcons();
    };
  });
</script>

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

<!-- iPod -->
<Ipod />

<!-- Windows -->
<ChatbotWindow on:open={() => handleWindowOpen('chatbot')} on:close={() => handleWindowClose('chatbot')} />
<OscillatorWindow on:open={() => handleWindowOpen('oscillator')} on:close={() => handleWindowClose('oscillator')} />
<NumerologyWindow on:open={() => handleWindowOpen('numerology')} on:close={() => handleWindowClose('numerology')} />
<GuestbookWindow on:open={() => handleWindowOpen('guestbook')} on:close={() => handleWindowClose('guestbook')} />
<PortfolioWindow on:open={() => handleWindowOpen('window-portfolio')} on:close={() => handleWindowClose('window-portfolio')} />
<ShopWindow on:open={() => handleWindowOpen('window-shop')} on:close={() => handleWindowClose('window-shop')} />

<!-- Taskbar -->
<Taskbar on:toggleStartMenu={toggleStartMenu} startMenuOpen={startMenuVisible} />

<!-- Start Menu -->
{#if startMenuVisible}
  <StartMenu on:close={() => startMenuVisible = false} />
{/if}

<style>
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
</style>

