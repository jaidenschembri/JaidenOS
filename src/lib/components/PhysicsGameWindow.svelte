<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import WindowWrapper from './WindowWrapper.svelte';
  import { windowsStore } from '$lib/stores/windows';

  // Ball physics properties
  interface Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    mass: number;
  }

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationId: number;
  let balls: Ball[] = [];
  let isRunning = false;
  let ballCount = 5;
  let gravity = 0.5;
  let bounce = 0.8;
  let friction = 0.99;

  // Color palette for balls
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  function createBall(): Ball {
    const radius = Math.random() * 20 + 10;
    return {
      x: Math.random() * (canvas.width - radius * 2) + radius,
      y: Math.random() * (canvas.height - radius * 2) + radius,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      radius,
      color: colors[Math.floor(Math.random() * colors.length)],
      mass: radius / 10
    };
  }

  function initializeBalls() {
    const newBalls = [];
    for (let i = 0; i < ballCount; i++) {
      newBalls.push(createBall());
    }
    balls = newBalls;
  }

  function updatePhysics() {
    if (!canvas || !ctx) return;

    balls.forEach(ball => {
      // Apply gravity
      ball.vy += gravity;
      
      // Apply friction
      ball.vx *= friction;
      ball.vy *= friction;
      
      // Update position
      ball.x += ball.vx;
      ball.y += ball.vy;
      
      // Boundary collision detection
      if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;
        ball.vx *= -bounce;
      }
      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx *= -bounce;
      }
      if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.vy *= -bounce;
      }
      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy *= -bounce;
      }
    });

    // Ball-to-ball collision detection
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const ball1 = balls[i];
        const ball2 = balls[j];
        
        const dx = ball2.x - ball1.x;
        const dy = ball2.y - ball1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < ball1.radius + ball2.radius) {
          // Collision detected - separate balls
          const overlap = ball1.radius + ball2.radius - distance;
          const separationX = (dx / distance) * overlap * 0.5;
          const separationY = (dy / distance) * overlap * 0.5;
          
          ball1.x -= separationX;
          ball1.y -= separationY;
          ball2.x += separationX;
          ball2.y += separationY;
          
          // Calculate collision response
          const normalX = dx / distance;
          const normalY = dy / distance;
          
          const relativeVelocityX = ball2.vx - ball1.vx;
          const relativeVelocityY = ball2.vy - ball1.vy;
          
          const velocityAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY;
          
          if (velocityAlongNormal > 0) continue;
          
          const restitution = 0.8;
          const impulse = -(1 + restitution) * velocityAlongNormal / (1/ball1.mass + 1/ball2.mass);
          
          ball1.vx -= impulse * normalX / ball1.mass;
          ball1.vy -= impulse * normalY / ball1.mass;
          ball2.vx += impulse * normalX / ball2.mass;
          ball2.vy += impulse * normalY / ball2.mass;
        }
      }
    }
  }

  function render() {
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw balls
    balls.forEach(ball => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      
      // Add a subtle glow effect
      ctx.shadowColor = ball.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Add highlight
      ctx.beginPath();
      ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
    });
  }

  function gameLoop() {
    if (!isRunning) return;
    
    updatePhysics();
    render();
    animationId = requestAnimationFrame(gameLoop);
  }

  function startSimulation() {
    if (!canvas) return;
    isRunning = true;
    gameLoop();
  }

  function stopSimulation() {
    isRunning = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  }

  function resetSimulation() {
    stopSimulation();
    initializeBalls();
    render();
  }

  function addBall() {
    if (balls.length < 20) {
      balls = [...balls, createBall()];
    }
  }

  function removeBall() {
    if (balls.length > 1) {
      balls = balls.slice(0, -1);
    }
  }

  function handleCanvasClick(event: MouseEvent) {
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Add explosion effect - push balls away from click point
    balls.forEach(ball => {
      const dx = ball.x - x;
      const dy = ball.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 10;
        ball.vx += (dx / distance) * force;
        ball.vy += (dy / distance) * force;
      }
    });
  }

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext('2d')!;
      canvas.width = 580;
      canvas.height = 320;
      initializeBalls();
      render();
    }
  });

  onDestroy(() => {
    stopSimulation();
  });

  $: windowState = $windowsStore['physics-game'];
</script>

{#if windowState}
  <WindowWrapper {windowState}>
    <div class="physics-game">
      <div class="controls">
        <div class="control-group">
          <button on:click={startSimulation} disabled={isRunning}>Start</button>
          <button on:click={stopSimulation} disabled={!isRunning}>Stop</button>
          <button on:click={resetSimulation}>Reset</button>
        </div>
        
        <div class="control-group">
          <button on:click={addBall} disabled={balls.length >= 20}>Add Ball</button>
          <button on:click={removeBall} disabled={balls.length <= 1}>Remove Ball</button>
        </div>
        
        <div class="control-group">
          <label>
            Gravity: 
            <input type="range" min="0" max="2" step="0.1" bind:value={gravity} />
            <span>{gravity.toFixed(1)}</span>
          </label>
        </div>
        
        <div class="control-group">
          <label>
            Bounce: 
            <input type="range" min="0" max="1" step="0.1" bind:value={bounce} />
            <span>{bounce.toFixed(1)}</span>
          </label>
        </div>
      </div>
      
      <canvas 
        bind:this={canvas}
        on:click={handleCanvasClick}
        title="Click to create explosion effects!"
      ></canvas>
      
      <div class="info">
        <p>Balls: {balls.length} | Click canvas for explosion effects!</p>
        <p>Physics: Gravity, collision detection, and realistic bouncing</p>
      </div>
    </div>
  </WindowWrapper>
{/if}

<style>
  .physics-game {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    background: #c0c0c0;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    padding: 5px;
    background: #e0e0e0;
    border: 2px inset #c0c0c0;
  }

  .control-group {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  button {
    padding: 4px 8px;
    background: #c0c0c0;
    border: 2px outset #c0c0c0;
    font-family: 'MS Sans Serif', sans-serif;
    font-size: 11px;
    cursor: pointer;
  }

  button:active {
    border: 2px inset #c0c0c0;
  }

  button:disabled {
    color: #808080;
    cursor: not-allowed;
  }

  label {
    font-family: 'MS Sans Serif', sans-serif;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  input[type="range"] {
    width: 60px;
  }

  canvas {
    border: 2px inset #c0c0c0;
    background: #000011;
    cursor: crosshair;
    flex: 1;
  }

  .info {
    font-family: 'MS Sans Serif', sans-serif;
    font-size: 11px;
    color: #000;
    text-align: center;
  }

  .info p {
    margin: 2px 0;
  }
</style> 