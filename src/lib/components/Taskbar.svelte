<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { windowsStore, focusWindow, openWindow } from '$lib/stores/windows';
  import { WindowsSounds } from '$lib/utils';
  import { getAssetPath } from '$lib/utils/assets';
  
  const dispatch = createEventDispatcher();
  let time = '--:--';
  let ipodVisible = true;
  
  // Prop to track start menu state
  export let startMenuOpen = false;
  
  function updateClock(): void {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    time = `${hours}:${minutes}`;
  }
  
  function toggleStartMenu(): void {
    WindowsSounds.playClickSound();
    dispatch('toggleStartMenu');
  }
  
  function toggleIpod(): void {
    WindowsSounds.playClickSound();
    ipodVisible = !ipodVisible;
    const ipod = document.getElementById('fixed-ipod');
    if (ipod) {
      ipod.classList.toggle('hidden', !ipodVisible);
    }
  }

  function handleTaskbarAppClick(id: string): void {
    WindowsSounds.playClickSound();
    $windowsStore[id].isMinimized 
      ? focusWindow(id) 
      : openWindow(id);
  }

  function handleSystemTrayClick(): void {
    WindowsSounds.playNotificationSound();
  }
  
  onMount(() => {
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    
    return () => {
      clearInterval(clockInterval);
    };
  });
</script>

<footer class="taskbar">
  <div class="taskbar-left">
    <!-- Start Button -->
    <div class="start-button" class:active={startMenuOpen} id="start-btn" on:click={toggleStartMenu}>
      <img src={getAssetPath('/icons/windows.png')} alt="Start Icon" />
      <span>Start</span>
    </div>

    <!-- Taskbar Apps -->
    <div class="taskbar-apps" id="taskbar-apps">
      {#each Object.values($windowsStore) as window}
        {#if window.isOpen}
          <div 
            class="taskbar-button" 
            class:active={!window.isMinimized}
            on:click={() => handleTaskbarAppClick(window.id)}
          >
            <img src={getAssetPath('/icons/folder-icon.png')} alt={window.title} class="taskbar-icon-img" />
            <span>{window.title}</span>
          </div>
        {/if}
      {/each}
    </div>
  </div>

  <!-- iPod toggle -->
  <button id="ipod-toggle-btn" title="Toggle iPod" on:click={toggleIpod} class:active={ipodVisible}>
    <img src={getAssetPath('/icons/audio-icon.png')} alt="Toggle iPod" class="ipod-toggle-icon" />
  </button>

  <!-- Right-side Tray -->
  <div class="taskbar-right-box">
    <div class="taskbar-icons">
      <!-- Social Media Icons -->
      <a href="https://x.com/jaiddog33" target="_blank" class="taskbar-icon" on:click={handleSystemTrayClick}>
        <img src={getAssetPath('/icons/twitter-icon.png')} alt="Twitter" class="tray-icon" />
      </a>
      <a href="https://www.instagram.com/jaidenschembri/" target="_blank" class="taskbar-icon" on:click={handleSystemTrayClick}>
        <img src={getAssetPath('/icons/instagram-icon.png')} alt="Instagram" class="tray-icon" />
      </a>
      <a href="https://www.twitch.tv/jaiddog28" target="_blank" class="taskbar-icon" on:click={handleSystemTrayClick}>
        <img src={getAssetPath('/icons/twitch-icon.png')} alt="Twitch" class="tray-icon" />
      </a>
    </div>
    <div class="taskbar-divider"></div>
    <div id="taskbar-clock" class="taskbar-clock">{time}</div>
  </div>
</footer>

<style>
  /* ===== TASKBAR BASE ===== */
  .taskbar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #c0c0c0;
    border-top: 2px solid #808080;
    box-shadow: inset 0 2px #fff;
    padding: 4px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 999;
    box-sizing: border-box;
    height: 40px;
  }

  /* ===== TASKBAR LAYOUT ===== */
  .taskbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .taskbar-apps {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    padding-right: 10px;
    overflow: hidden;
  }

  .taskbar-right-box {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 8px;
    background: #dcdcdc;
    border: 2px solid #999;
    border-radius: 2px;
    box-shadow:
      inset -1px -1px 0 #fff,
      inset 1px 1px 0 #888;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ===== TASKBAR BUTTONS ===== */
  .taskbar-button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1px;
    width: 120px;
    min-width: 120px;
    max-width: 120px;
    height: 28px;
    background: #dcdcdc;
    border: 2px solid #999;
    color: #000;
    font-family: 'VT323', monospace;
    font-size: 15px;
    padding: 0 6px;
    cursor: pointer;
    border-radius: 2px;
    box-sizing: border-box;
    flex-shrink: 0;
    box-shadow:
      inset 1px 1px 0 #fff,
      inset -1px -1px 0 #888,
      2px 2px 0 #444;
    transition: background 0.2s, border 0.2s, box-shadow 0.1s ease-in-out;
  }

  .taskbar-button.active {
    background: #aaa;
    border-color: #777;
    box-shadow:
      inset -1px -1px 0 #fff,
      inset 1px 1px 0 #555;
    color: #fff;
  }

  .taskbar-button span {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: 5px;
  }

  .taskbar-button:hover img {
    filter: grayscale(0) brightness(1.1);
  }

  /* ===== TASKBAR ICONS ===== */
  .taskbar-icons {
    display: flex;
    align-items: center;
    gap: 0px;
  }

  .taskbar-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px;
    border-radius: 3px;
    transition: background 0.2s;
  }

  .taskbar-icon-img {
    width: 33px;
    height: 33px;
    object-fit: contain;
    filter: grayscale(0.2);
    transition: filter 0.2s;
    margin-left: -2px;
    flex-shrink: 0;
    display: block;
  }

  .tray-icon {
    width: 16px;
    height: 16px;
  }

  .taskbar-icon:hover img {
    filter: grayscale(0) brightness(1.1);
  }

  /* ===== TASKBAR UTILITIES ===== */
  .taskbar-divider {
    width: 3px;
    height: 20px;
    background: #c0c0c0;
    box-shadow:
      inset 1px 0 #fff,
      inset -1px 0 #888;
    margin: 0 4px;
    flex-shrink: 0;
  }

  .taskbar-clock {
    font-family: 'VT323', monospace;
    font-size: 14px;
    line-height: 1;
    padding: 2px;
    color: #000;
    white-space: nowrap;
    user-select: none;
    letter-spacing: 0;
    margin-top: 4px;
  }

  /* ===== START BUTTON ===== */
  .start-button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1px;
    width: 90px;
    height: 28px;
    background: #dcdcdc;
    border: 2px solid #999;
    color: #000;
    font-family: 'VT323', monospace;
    font-weight: bold;
    font-size: 15px;
    padding: 0 6px;
    cursor: pointer;
    border-radius: 2px;
    box-sizing: border-box;
    flex-shrink: 0;
    box-shadow:
      inset 1px 1px 0 #fff,
      inset -1px -1px 0 #888,
      2px 2px 0 #444;
    transition: background 0.2s, border 0.2s, box-shadow 0.1s ease-in-out;
  }

  .start-button.active {
    background: #aaa;
    border-color: #777;
    box-shadow:
      inset -1px -1px 0 #fff,
      inset 1px 1px 0 #555;
    color: #fff;
  }

  .start-button img {
    width: 33px;
    height: 33px;
    object-fit: contain;
    filter: grayscale(0.2);
    transition: filter 0.2s;
    margin-left: -2px;
    flex-shrink: 0;
    display: block;
  }

  /* ===== IPOD TOGGLE BUTTON ===== */
  #ipod-toggle-btn {
    background: #dcdcdc;
    border: 2px solid #999;
    padding: 0 6px;
    margin-right: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    width: 32px;
    font-family: 'VT323', monospace;
    border-radius: 2px;
    box-sizing: border-box;
    flex-shrink: 0;
    box-shadow:
      inset 1px 1px 0 #fff,
      inset -1px -1px 0 #888,
      2px 2px 0 #444;
    transition: background 0.2s, border 0.2s, box-shadow 0.1s ease-in-out;
  }

  #ipod-toggle-btn:hover {
    background: #dcdcdc;
  }

  #ipod-toggle-btn:active {
    background: #aaa;
    border-color: #777;
    box-shadow:
      inset -1px -1px 0 #fff,
      inset 1px 1px 0 #555;
  }

  #ipod-toggle-btn.active {
    background: #aaa;
    border-color: #777;
    box-shadow:
      inset -1px -1px 0 #fff,
      inset 1px 1px 0 #555;
  }

  .ipod-toggle-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
    filter: brightness(0.3);
    transition: filter 0.2s ease;
  }

  #ipod-toggle-btn.active .ipod-toggle-icon {
    filter: brightness(0.8) sepia(1) hue-rotate(90deg) saturate(2);
  }

  #ipod-toggle-btn:hover .ipod-toggle-icon {
    filter: brightness(0.5);
  }

  /* ===== SYSTEM TRAY ICONS ===== */
  .system-tray-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 4px;
    cursor: pointer;
    border-radius: 2px;
    transition: background 0.2s;
    margin: 0 1px;
  }

  .system-tray-icon:hover {
    background: #b0b0b0;
    border: 1px inset #ddd;
  }

  .tray-emoji {
    font-size: 12px;
    filter: grayscale(0.3);
    transition: filter 0.2s;
  }

  .system-tray-icon:hover .tray-emoji {
    filter: grayscale(0);
  }

  /* ===== MOBILE RESPONSIVE STYLES ===== */
  @media (max-width: 768px) {
    /* Keep taskbar exactly like desktop */
    .taskbar {
      padding: 4px 10px;
      height: 40px;
    }

    .taskbar-left {
      gap: 12px;
    }

    .taskbar-apps {
      gap: 8px;
      padding-right: 10px;
    }

    /* Mobile taskbar buttons - icon only but same size and styling as desktop */
    .taskbar-button {
      width: 40px;
      min-width: 40px;
      max-width: 40px;
      height: 28px;
      padding: 0 6px;
      justify-content: center;
      /* All other styles inherited from desktop */
    }

    .taskbar-button span {
      display: none; /* Hide text on mobile */
    }

    .taskbar-button .taskbar-icon-img {
      width: 33px;
      height: 33px;
      margin-left: 0;
    }

    /* Keep system tray exactly like desktop */
    .taskbar-right-box {
      padding: 2px 8px;
      gap: 6px;
    }

    .taskbar-clock {
      font-size: 14px;
      margin-top: 4px;
    }

    .tray-icon {
      width: 16px;
      height: 16px;
    }

    .taskbar-divider {
      width: 3px;
      height: 20px;
      margin: 0 4px;
    }
  }

  /* Extra small mobile devices */
  @media (max-width: 480px) {
    /* Keep everything exactly like desktop except app button width */
    .taskbar {
      padding: 4px 10px;
    }

    .taskbar-left {
      gap: 12px;
    }

    .taskbar-apps {
      gap: 8px;
      padding-right: 10px;
    }

    .taskbar-button {
      width: 36px;
      min-width: 36px;
      max-width: 36px;
      height: 28px;
    }

    .taskbar-button .taskbar-icon-img {
      width: 33px;
      height: 33px;
    }
  }
</style> 