<script lang="ts">
  import { onMount } from 'svelte';
  import { windowsStore } from '$lib/stores/windows';
  import WindowWrapper from '$lib/components/WindowWrapper.svelte';
  
  // Audio state
  let audioCtx: AudioContext | null = null;
  let oscillator: OscillatorNode | null = null;
  let analyser: AnalyserNode | null = null;
  let dataArray: Uint8Array | null = null;
  let iPodAudio: HTMLAudioElement | null = null;
  let iPodAnalyser: AnalyserNode | null = null;
  let iPodDataArray: Uint8Array | null = null;
  let isRunning = false;
  
  // DOM elements
  let canvas: HTMLCanvasElement | null = null;
  let frequency = 440;
  let header: HTMLElement | null = null;
  let windowEl: HTMLElement | null = null;
  let ipodWheel: HTMLElement | null = null;
  let ipodBody: HTMLElement | null = null;
  let ipodScreen: HTMLElement | null = null;
  let frequencyValue: HTMLElement | null = null;
  let startButton: HTMLButtonElement | null = null;
  let stopButton: HTMLButtonElement | null = null;
  let visualizerToggle: HTMLButtonElement | null = null;
  let isVisualizerMode = false;
  
  /**
   * Set up the audio visualizer for the iPod audio element
   */
  function setupVisualizer(): void {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (!iPodAudio) return;
    
    const source = audioCtx.createMediaElementSource(iPodAudio);
    iPodAnalyser = audioCtx.createAnalyser();
    iPodAnalyser.fftSize = 256;
    iPodDataArray = new Uint8Array(iPodAnalyser.frequencyBinCount);
    source.connect(iPodAnalyser);
    iPodAnalyser.connect(audioCtx.destination);
  }
  
  /**
   * Calculate the dominant frequency from analyzer data
   */
  function getDominantFrequency(data: Uint8Array): number {
    let maxVal = -Infinity;
    let index = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] > maxVal) {
        maxVal = data[i];
        index = i;
      }
    }
    return (index / data.length) * 2000;
  }
  
  /**
   * Generate a color based on frequency with a chakra-inspired mapping
   */
  function getChakraColor(freq: number): string {
    const minFreq = 20;
    const maxFreq = 2000;
    const clamped = Math.max(minFreq, Math.min(freq, maxFreq));
  
    const logMin = Math.log(minFreq);
    const logMax = Math.log(maxFreq);
    const logFreq = Math.log(clamped);
    const t = (logFreq - logMin) / (logMax - logMin);
  
    const hue = (t * 360 + Math.random() * 20) % 360; // small hue jump
    const sat = 90 + Math.random() * 10;
    const light = 55 + Math.random() * 15;
  
    return `hsl(${Math.floor(hue)}, ${sat}%, ${light}%)`;
  }
  
  /**
   * Update all UI elements with a glow effect based on frequency
   */
  function updateGlow(freq: number): void {
    const color = getChakraColor(freq);
    const glow = 60;
  
    // Apply effects to oscilloscope
    if (canvas) {
      canvas.style.boxShadow = `0 0 ${glow}px ${color}`;
    }
    
    // Apply effects to window header
    if (header) {
      header.style.backgroundColor = color;
      header.style.boxShadow = `0 0 12px ${color}`;
    }
    
    // Apply effects to window
    if (windowEl) {
      windowEl.style.boxShadow = `0 0 ${glow}px ${color}`;
      windowEl.style.border = `2px solid ${color}`;
    }
    
    // Apply effects to iPod wheel
    if (ipodWheel) {
      const pulse = 12 + Math.sin(Date.now() * 0.008) * 12;
      ipodWheel.style.boxShadow = `
        0 0 ${pulse}px ${color},
        0 0 ${pulse * 2}px ${color}
      `;
    }
    
    // Apply effects to iPod body
    if (ipodBody) {
      ipodBody.style.boxShadow = `inset 0 0 8px ${color}, 0 0 18px ${color}`;
      ipodBody.style.borderColor = color;
    }
    
    // Apply effects to iPod screen
    if (ipodScreen) {
      ipodScreen.style.setProperty("background-color", color, "important");
      ipodScreen.style.boxShadow = `inset 0 0 12px rgba(0,0,0,0.2), 0 0 14px ${color}`;
    }
  }
  
  /**
   * Remove all glow effects from UI elements
   */
  function fadeGlow(): void {
    if (!canvas || !header || !windowEl) return;

    canvas.style.boxShadow = 'none';
    header.style.background = '';
    header.style.boxShadow = '';
    windowEl.style.boxShadow = '';
    windowEl.style.borderColor = '';
    
    if (ipodWheel) {
      ipodWheel.style.boxShadow = '';
    }
  }
  
  /**
   * Draw the oscilloscope visualization
   */
  function drawOscilloscope(): void {
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const WIDTH = canvas.clientWidth;
    const HEIGHT = canvas.clientHeight;
    
    // Set canvas dimensions to match display size
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    const visualizerOn = isVisualizerMode && iPodAudio && !iPodAudio.paused;

    if (visualizerOn) {
      // Handle iPod audio visualization mode
      if (!iPodAnalyser) setupVisualizer();
      if (!iPodDataArray || !iPodAnalyser) return;
      
      iPodAnalyser.getByteFrequencyData(iPodDataArray);

      const freq = getDominantFrequency(iPodDataArray);
      const color = getChakraColor(freq);
      updateGlow(freq);

      // Draw frequency visualization
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.shadowBlur = 18;

      ctx.beginPath();
      const sliceWidth = WIDTH / iPodDataArray.length;
      let x = 0;
      for (let i = 0; i < iPodDataArray.length; i++) {
        const v = iPodDataArray[i] / 255.0;
        const y = HEIGHT - (v * HEIGHT);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();
    } else if (analyser && oscillator && dataArray) {
      // Handle oscillator visualization mode
      analyser.getByteTimeDomainData(dataArray);
      const freq = frequency;
      const color = getChakraColor(freq);
      updateGlow(freq);

      // Draw waveform visualization
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;

      ctx.beginPath();
      const sliceWidth = WIDTH / dataArray.length;
      let x = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * HEIGHT / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(WIDTH, HEIGHT / 2);
      ctx.stroke();
    } else {
      // Show a default waveform or grid when nothing is active
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      
      // Draw center line
      ctx.beginPath();
      ctx.moveTo(0, HEIGHT / 2);
      ctx.lineTo(WIDTH, HEIGHT / 2);
      ctx.stroke();
      
      // Draw grid lines
      for (let i = 0; i < WIDTH; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, HEIGHT);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
      fadeGlow();
    }

    // Continue animation loop
    requestAnimationFrame(drawOscilloscope);
  }
  
  /**
   * Start the oscillator and visualization
   */
  function startOscillator(): void {
    if (isVisualizerMode) return; // Skip if in visualizer mode

    // Create audio context if it doesn't exist
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Configure oscillator
    oscillator = audioCtx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // Set up analyzer
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.8;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Connect audio nodes
    oscillator.connect(analyser);
    analyser.connect(audioCtx.destination);
    oscillator.start();
    isRunning = true;

    // Update UI
    if (startButton && stopButton) {
      startButton.disabled = true;
      stopButton.disabled = false;
    }

    // Start visualization
    drawOscilloscope();
  }
  
  /**
   * Stop the oscillator and clean up
   */
  function stopOscillator(): void {
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
    }
    
    if (analyser) {
      analyser.disconnect();
      analyser = null;
    }
    
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
    
    isRunning = false;
    
    if (startButton && stopButton) {
      startButton.disabled = false;
      stopButton.disabled = true;
    }
    
    fadeGlow();
  }
  
  /**
   * Update oscillator frequency
   */
  function updateFrequency(event: Event): void {
    const target = event.target as HTMLInputElement;
    frequency = parseFloat(target.value);
    
    if (frequencyValue) {
      frequencyValue.textContent = `${frequency} Hz`;
    }
    
    if (isVisualizerMode) return; // Skip if in visualizer mode
    
    if (isRunning && oscillator && audioCtx) {
      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    }
    
    updateGlow(frequency);
  }
  
  /**
   * Handle visualization mode toggle
   */
  function toggleVisualizationMode(): void {
    isVisualizerMode = !isVisualizerMode;
    
    // If switching to visualizer mode while oscillator is running, stop it
    if (isVisualizerMode && oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
      analyser = null;
      isRunning = false;
      
      if (startButton && stopButton) {
        startButton.disabled = false;
        stopButton.disabled = true;
      }
    }
    
    drawOscilloscope();
  }
  
  onMount(() => {
    // Get DOM elements
    canvas = document.getElementById('oscilloscope') as HTMLCanvasElement;
    header = document.getElementById("oscillator-header");
    windowEl = document.getElementById("oscillator");
    ipodWheel = document.querySelector(".ipod-wheel");
    ipodBody = document.querySelector(".ipod-nano-body");
    ipodScreen = document.querySelector(".ipod-screen");
    frequencyValue = document.getElementById('frequencyValue');
    startButton = document.getElementById('startButton') as HTMLButtonElement;
    stopButton = document.getElementById('stopButton') as HTMLButtonElement;
    visualizerToggle = document.getElementById('visualizerToggle') as HTMLButtonElement;
    iPodAudio = document.getElementById('audio') as HTMLAudioElement;
    
    // Start visualization loop
    requestAnimationFrame(drawOscilloscope);
    
    return () => {
      if (isRunning) {
        stopOscillator();
      }
    };
  });
</script>

<WindowWrapper windowState={$windowsStore['oscillator']}>
  <div class="oscillator-clean">
    <div class="frequency-section">
      <label for="frequencyInput">Frequency:</label>
      <input id="frequencyInput" type="range" min="20" max="2000" value="440" on:input={updateFrequency} />
      <span id="frequencyValue">440 Hz</span>
    </div>

    <div class="visualizer-section">
      <!-- Visual Audio Toggle -->
      <button id="visualizerToggle" on:click={toggleVisualizationMode} class:active={isVisualizerMode}>
        Visual Audio
      </button>
    
      <canvas id="oscilloscope" width="560" height="90"></canvas>
    </div>
  
    <div class="controls-section">
      <div class="oscillator-controls">
        <button id="startButton" on:click={startOscillator}>Start</button>
        <button id="stopButton" disabled on:click={stopOscillator}>Stop</button>
      </div>
    </div>
  </div>
</WindowWrapper>

<style>
  .oscillator-clean {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 18px;
    box-sizing: border-box;
    font-size: 16px;
    background-color: #c0c0c0;
    overflow-y: auto;
    gap: 15px;
  }

  .frequency-section {
    padding: 15px;
    border: 2px inset #888;
    background-color: #f0f0f0;
  }

  .visualizer-section {
    padding: 15px;
    border: 2px inset #888;
    background-color: #f0f0f0;
    text-align: center;
  }

  .controls-section {
    padding: 15px;
    border: 2px inset #888;
    background-color: #f0f0f0;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }

  #frequencyInput {
    width: 100%;
    appearance: none;
    height: 8px;
    background: linear-gradient(to right, #ff70d9, #88f);
    border-radius: 4px;
    outline: none;
    margin: 4px 0 10px;
    cursor: pointer;
  }

  #frequencyInput::-webkit-slider-thumb,
  #frequencyInput::-moz-range-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #88f;
    box-shadow: 0 0 5px #88f;
  }

  #frequencyValue {
    font-size: 14px;
    margin-bottom: 10px;
    color: #111;
  }
  
  canvas {
    width: 100%;
    height: 90px;
    border: 2px inset #888;
    background-color: #002200;
    position: relative;
    z-index: 1;
  }
  
  .oscillator-controls {
    display: flex;
    gap: 10px;
  }
  
  button {
    padding: 8px 16px;
    background-color: #c0c0c0;
    border: 2px outset #f0f0f0;
    cursor: pointer;
    font-family: 'VT323', monospace;
    font-size: 14px;
    color: #000;
  }

  button:hover:not(:disabled) {
    background-color: #d0d0d0;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  button:active:not(:disabled) {
    border-style: inset;
  }

  #visualizerToggle.active {
    background-color: #a0a0a0;
    border-style: inset;
  }
  
  #visualizerToggle {
    margin-bottom: 10px;
  }
  
  /* Retro scrollbar styling */
  .oscillator-clean::-webkit-scrollbar {
    width: 16px;
  }

  .oscillator-clean::-webkit-scrollbar-track {
    background: #c0c0c0;
    border: 1px inset #888;
  }

  .oscillator-clean::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border: 1px outset #888;
  }

  .oscillator-clean::-webkit-scrollbar-thumb:hover {
    background: #d0d0d0;
  }

  .oscillator-clean::-webkit-scrollbar-button {
    background: #c0c0c0;
    border: 1px outset #888;
    height: 16px;
  }

  .oscillator-clean::-webkit-scrollbar-button:hover {
    background: #d0d0d0;
  }
</style> 