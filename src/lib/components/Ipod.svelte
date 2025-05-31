<script lang="ts">
  import { onMount } from 'svelte';

  interface Track {
    title: string;
    src: string;
  }

  let audio: HTMLAudioElement;
  let trackTitleEl: HTMLElement;
  let currentTrack = 0;
  
  const playlist: Track[] = [
    { title: 'Such Great Heights', src: 'mp3s/Such Great Heights.mp3' },
    { title: 'Into Dust', src: 'mp3s/Into Dust.mp3' },
    { title: 'Welcome To The Black Parade', src: 'mp3s/Welcome To The Black Parade.mp3' },
    { title: 'Summit', src: 'mp3s/Skrillex - Summit (feat. Ellie Goulding) [Video by Pilerats].mp3' },
    { title: '54321', src: 'mp3s/A Rocket To The Moon - 54321 [HD].mp3' },
    { title: 'Im God', src: 'mp3s/Imgod.mp3' },
    { title: 'Dance Inside', src: 'mp3s/Dance Inside.mp3' },
  ];

  /**
   * Load a track from the playlist
   */
  function loadTrack(i: number, shouldPlay: boolean = true): void {
    currentTrack = i;
    const track = playlist[i];
    audio.src = track.src;
    trackTitleEl.textContent = track.title;

    if (shouldPlay) {
      audio.play().catch(err => console.warn('Autoplay error:', err));
    }
  }

  /**
   * Toggle play/pause
   */
  function playPause(): void {
    if (audio.paused) {
      audio.play().catch(err => console.warn('Play error:', err));
    } else {
      audio.pause();
    }
  }

  /**
   * Play the next track
   */
  function nextTrack(): void {
    const next = (currentTrack + 1) % playlist.length;
    loadTrack(next, true); // force autoplay
  }

  /**
   * Play the previous track
   */
  function prevTrack(): void {
    const prev = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(prev, true); // force autoplay
  }

  /**
   * Adjust the volume
   */
  function changeVolume(delta: number): void {
    audio.volume = Math.min(1, Math.max(0, audio.volume + delta));
  }
  
  onMount(() => {
    // Get DOM elements
    trackTitleEl = document.getElementById('nano-title') as HTMLElement;
    
    // Set up event listeners
    audio.addEventListener('ended', nextTrack);
    
    audio.addEventListener('pause', () => {
      window.dispatchEvent(new CustomEvent('ipodPaused'));
    });
    
    // Initial track on load (autoplay off)
    loadTrack(currentTrack, false);
  });
</script>

<div id="fixed-ipod" class="fixed-ipod">
  <div class="ipod-nano-body" id="ipod-drag">
    <div class="ipod-logo">
      <img src="/pixelated/ipod.gif" class="ipod-logo-img" alt="Apple logo" />
    </div>
    <div class="ipod-screen">
      <div class="nano-text" id="nano-track">
        Now Playing:<br><span id="nano-title">-</span>
      </div>
    </div>
    <div class="ipod-wheel-container">
      <div class="ipod-wheel">
        <div class="ipod-btn top" on:click={prevTrack}>⏮</div>
        <div class="ipod-btn bottom" on:click={nextTrack}>⏭</div>
        <div class="ipod-btn left" on:click={() => changeVolume(-0.1)}>🔉</div>
        <div class="ipod-btn right" on:click={() => changeVolume(0.1)}>🔊</div>
        <div class="ipod-center" on:click={playPause}>⏯</div>
      </div>
    </div>
  </div>
  <audio bind:this={audio} id="audio"></audio>
</div>

<style>
  /* ===== IPOD COMPONENT ===== */
  /* Styling for the iPod nano interface */

  /* ===== CONTAINER ===== */
  .ipod-nano {
    display: flex;
    justify-content: center;
    margin: 0 auto;
  }

  .ipod-nano-body {
    width: 180px;
    background: 
      linear-gradient(#dcdcdc, #aaa),
      url('https://transparenttextures.com/patterns/brushed-alum.png');
    background-blend-mode: overlay;
    border: 3px solid #888;
    border-radius: 30px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    box-shadow: 
      inset 0 0 6px rgba(0,0,0,0.2),
      0 1px 4px rgba(255,255,255,0.3);
  }

  /* ===== LOGO ===== */
  .ipod-logo {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    padding-bottom: 8px;
  }

  .ipod-logo-img {
    width: 60px;
    height: auto;
    image-rendering: pixelated;
  }

  /* ===== SCREEN ===== */
  .ipod-screen {
    background: linear-gradient(to bottom, #e4eef5 0%, #b7c9d4 100%);
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.25);
    color: #111;
    width: 140px;
    height: 80px;
    border-radius: 6px;
    border: 3px inset #999;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 40px 0 20px;
    text-align: center;
    font-size: 14px;
    padding: 6px;
    font-family: 'VT323', monospace;
    letter-spacing: 0.5px;
    backdrop-filter: blur(2px);
  }
  
  .nano-text {
    line-height: 1.2;
  }

  #nano-title {
    font-weight: bold;
    display: block;
    margin-top: 5px;
  }

  /* ===== CONTROL WHEEL ===== */
  .ipod-wheel-container {
    position: relative;
    width: 120px;
    height: 120px;
  }

  .ipod-wheel {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid #666;
    background: radial-gradient(circle, #e0e0e0, #cfcfcf);
    position: relative;
    box-shadow:
      inset -2px -2px 4px #fff,
      inset 2px 2px 4px #999;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: glow 2.5s infinite ease-in-out;
  }

  /* ===== CONTROL BUTTONS ===== */
  .ipod-btn {
    position: absolute;
    width: auto;
    height: auto;
    background: none;
    border: none;
    font-size: 18px;
    font-family: 'VT323', monospace;
    color: #333;
    cursor: pointer;
    padding: 2px 6px;
    user-select: none;
    text-shadow: 1px 1px 0 #fff, -1px -1px 0 #ccc;
    transition: transform 0.1s ease-in-out;
  }

  .ipod-btn:active {
    color: #111;
    text-shadow: none;
  }

  .ipod-btn.top {
    top: 4px;
    left: 50%;
    transform: translateX(-50%);
  }

  .ipod-btn.bottom {
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
  }

  .ipod-btn.left {
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
  }

  .ipod-btn.right {
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
  }

  .ipod-center {
    width: 48px;
    height: 48px;
    background: radial-gradient(circle at center, #ccc 0%, #aaa 100%);
    border: 0px solid #999;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    inset: 0;
    margin: auto;
    font-size: 16px;
    box-shadow:
      inset 1px 1px 2px rgba(255, 255, 255, 0.8),
      inset -1px -1px 2px rgba(0, 0, 0, 0.25);
    transition: all 0.1s ease-in-out;
    cursor: pointer;
  }

  /* ===== FIXED POSITION ===== */
  .fixed-ipod {
    position: fixed;
    bottom: 52px;
    right: 4px;
    z-index: 999;
    cursor: grab;
  }

  .fixed-ipod:active {
    cursor: grabbing;
  }

  /* ===== RESPONSIVE SCALING ===== */
  @media (min-width: 769px) and (max-width: 1024px) {
    .ipod-nano-body {
      transform: scale(0.9);
      transform-origin: bottom right;
    }
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    .ipod-nano-body {
      transform: scale(1);
      transform-origin: bottom right;
    }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow:
        inset -2px -2px 4px #fff,
        inset 2px 2px 4px #999;
    }
    50% {
      box-shadow:
        inset -2px -2px 4px #fff,
        inset 2px 2px 4px #999,
        0 0 5px rgba(255, 255, 255, 0.5);
    }
  }
</style> 