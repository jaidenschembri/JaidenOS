<script lang="ts">
  import { windowsStore } from '$lib/stores/windows';
  import WindowWrapper from '$lib/components/WindowWrapper.svelte';
  
  let birthdayInput = '';
  let outputContent = '';
  let showOutput = false;
  
  /**
   * Generate numerology reading based on input birthday
   */
  function generateNumerology(): void {
    if (!birthdayInput) {
      outputContent = "👻 you must enter a birthdate, time traveler.";
      showOutput = true;
      return;
    }
    
    // Clean and split input
    const digits = birthdayInput.replaceAll("-", "").split("").map(Number);
    
    // Add all digits straight across
    let sum = digits.reduce((a, b) => a + b, 0);
    
    // If sum is 20, override as 11 (custom rule)
    if (sum === 20) {
      sum = 11;
    } else {
      // Reduce until single digit or master number
      while (sum > 9 && ![11, 22, 33].includes(sum)) {
        sum = sum.toString().split("").reduce((a, b) => a + Number(b), 0);
      }
    }
    
    // Output messages (custom meanings)
    const meanings: Record<number, string> = {
      1: `
    <strong>Life Path Number: 1</strong><br>
    ✨ <strong>The Leader</strong><br>
    <em>High Vibe:</em> Independent · Visionary · Confident · Self-sufficient<br>
    <em>Low Vibe:</em> Controlling · Isolated · Arrogant · Overworked<br>
    <strong>Keywords:</strong> Identity · Power · Creation · Drive<br><br>
    
    You came here to do it first.  
    You're not meant to blend in, you're meant to disrupt — to pioneer.  
    Leadership isn't about control, it's about courage.  
    Walk your path like it's a signal. Because it is.
    `,
    
      3: `
    <strong>Life Path Number: 3</strong><br>
    🎭 <strong>The Performer</strong><br>
    <em>High Vibe:</em> Expressive · Charismatic · Creative · Inspiring<br>
    <em>Low Vibe:</em> Scattered · Overdramatic · Avoidant · Superficial<br>
    <strong>Keywords:</strong> Voice · Emotion · Creativity · Connection<br><br>
    
    You're a mirror with a mic.  
    People feel your energy before you speak — but speaking is where you shine.  
    Just remember: your power isn't just in the show — it's in your **story**.
    `,
    
      4: `
    <strong>Life Path Number: 4</strong><br>
    🧱 <strong>The Enforcer</strong><br>
    <em>High Vibe:</em> Loyal · Disciplined · Grounded · Protective<br>
    <em>Low Vibe:</em> Bitter · Controlling · Rigid · Fear-based<br>
    <strong>Keywords:</strong> Stability · Structure · Karma · Loyalty<br><br>
    
    You were born with bricks in your hands.  
    You build the foundation others walk on.  
    It isn't always fair — but you're not here for easy.  
    You're here to make it **real**.
    `,
    
      5: `
    <strong>Life Path Number: 5</strong><br>
    ⚡ <strong>The Agent of Chaos</strong><br>
    <em>High Vibe:</em> Free · Fearless · Magnetic · Unpredictable<br>
    <em>Low Vibe:</em> Addictive · Impulsive · Unstable · Distracted<br>
    <strong>Keywords:</strong> Change · Rebellion · Sensation · Movement<br><br>
    
    You're a glitch in the grid.  
    Routine kills your spirit — freedom feeds it.  
    You live to feel. But don't get lost in the loop.  
    You're here to shake things up — and teach others how to ride the wave.
    `,
    
      6: `
    <strong>Life Path Number: 6</strong><br>
    🌹 <strong>The Protector</strong><br>
    <em>High Vibe:</em> Nurturing · Loyal · Harmonious · Devoted<br>
    <em>Low Vibe:</em> Over-responsible · Co-dependent · Controlling · Guilt-driven<br>
    <strong>Keywords:</strong> Family · Beauty · Service · Healing<br><br>
    
    You're the one people call when they're falling apart.  
    But who holds you?  
    You're here to love deeply — but the lesson is learning where love ends and **self-abandonment** begins.
    `,
    
      7: `
    <strong>Life Path Number: 7</strong><br>
    🔍 <strong>The Watcher</strong><br>
    <em>High Vibe:</em> Insightful · Spiritual · Wise · Self-aware<br>
    <em>Low Vibe:</em> Cold · Detached · Paranoid · Over-isolated<br>
    <strong>Keywords:</strong> Solitude · Study · Truth · Secrets<br><br>
    
    You were born between dimensions.  
    You don't do small talk — you crave the real, the hidden, the encoded.  
    Let people in... but not too far.  
    You're not meant to be understood — you're meant to **observe, decode, and reveal**.
    `,
    
      8: `
    <strong>Life Path Number: 8</strong><br>
    💼 <strong>The Executive</strong><br>
    <em>High Vibe:</em> Powerful · Ambitious · Strategic · Resourceful<br>
    <em>Low Vibe:</em> Ruthless · Obsessive · Greedy · Numb<br>
    <strong>Keywords:</strong> Karma · Power · Wealth · Discipline<br><br>
    
    You're here to master both the material and the spiritual.  
    Money follows energy — and you move with **force**.  
    Your karma is heavy, but your legacy can be legendary.  
    Learn when to hold... and when to build.
    `,
    
      9: `
    <strong>Life Path Number: 9</strong><br>
    🧨 <strong>The Reactor</strong><br>
    <em>High Vibe:</em> Passionate · Creative · Deep · Altruistic<br>
    <em>Low Vibe:</em> Resentful · Chaotic · Self-righteous · Burned-out<br>
    <strong>Keywords:</strong> Emotion · Completion · Justice · Expression<br><br>
    
    You're a vessel for big feelings.  
    Your rage is sacred. So is your heartbreak.  
    You're here to end cycles — but first, you have to **end your own loops**.  
    Let it go. Then let it out.
    `,
    
      11: `
    <strong>Life Path Number: 11</strong><br>
    ⚡ <strong>The Channel</strong><br>
    <em>High Vibe:</em> Visionary · Intuitive · Magnetic · Empathic<br>
    <em>Low Vibe:</em> Anxious · Oversensitive · Conflicted · Unstable<br>
    <strong>Keywords:</strong> Insight · Duality · Awakening · Light<br><br>
    
    You came encoded with light.  
    But light bends through shadow.  
    Your life may feel like too much — because it is.  
    This is a Master Number.<br>
    You're not here to be comfortable.  
    You're here to **wake people up**.
    `,
    
      22: `
    <strong>Life Path Number: 22</strong><br>
    🏗️ <strong>The Master Builder</strong><br>
    <em>High Vibe:</em> Visionary · Grounded · Impactful · Architect<br>
    <em>Low Vibe:</em> Overwhelmed · Frozen · Cynical · Isolated<br>
    <strong>Keywords:</strong> Manifestation · Structure · Pressure · Legacy<br><br>
    
    You weren't made for small talk or small plans.  
    You carry the blueprint for something massive — a system, a structure, a shift.  
    This is a Master Number.<br>
    If you doubt yourself, the mission stalls.  
    Step up, stay focused, build something **timeless**.
    `,
    
      33: `
    <strong>Life Path Number: 33</strong><br>
    💎 <strong>The Amplified Healer</strong><br>
    <em>High Vibe:</em> Radiant · Compassionate · Expressive · Devotional<br>
    <em>Low Vibe:</em> Self-erasing · Emotionally volatile · Overburdened · Misunderstood<br>
    <strong>Keywords:</strong> Healing · Expression · Service · Intensity<br><br>
    
    You weren't built for soft missions.  
    You're here to carry the weight *and* the light.  
    Your presence alone shifts timelines — but your greatest challenge is learning to protect your own frequency.<br><br>
    
    <strong>This is a Master Number.</strong><br>
    You don't walk a normal path. Most people won't understand you — and that's okay.  
    You're not here to be understood.  
    You're here to **amplify what's sacred**.
    `
    };
    
    const message = meanings[sum] || "💥 Glitch in the matrix. That number doesn't exist in this plane.";
    
    outputContent = message;
    showOutput = true;
  }
  
  function clearOutput(): void {
    outputContent = '';
    showOutput = false;
    birthdayInput = '';
  }
</script>

<WindowWrapper windowState={$windowsStore['numerology']}>
  <div class="numerology-container">
    <div class="form-row">
      <input id="birthday-input" type="date" bind:value={birthdayInput} />
      <button on:click={generateNumerology}>Reveal</button>
      {#if showOutput}
        <button on:click={clearOutput} class="clear-btn">Clear</button>
      {/if}
    </div>
    
    {#if showOutput}
      <div class="numerology-output">
        {@html outputContent}
      </div>
    {/if}
  </div>
</WindowWrapper>

<style>
  .numerology-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
  }
  
  .form-row {
    display: flex;
    gap: 10px;
    padding: 15px;
    flex-shrink: 0;
  }
  
  .form-row input {
    flex: 1;
    padding: 8px;
    border: 2px inset #888;
    background-color: white;
    color: #000;
    font-family: 'VT323', monospace;
    font-size: 14px;
  }
  
  .form-row button {
    padding: 8px 15px;
    background-color: #c0c0c0;
    border: 2px outset #f0f0f0;
    cursor: pointer;
    font-family: 'VT323', monospace;
    font-size: 14px;
    color: #000;
  }
  
  .form-row button:hover {
    background-color: #d0d0d0;
  }
  
  .form-row button:active {
    border-style: inset;
  }
  
  .numerology-output {
    flex: 1;
    background-color: white;
    border: 2px inset #888;
    padding: 15px;
    overflow-y: auto;
    margin: 0 15px 15px 15px;
    font-family: 'VT323', monospace;
    font-size: 14px;
    color: #000;
    line-height: 1.4;
  }

  /* Retro scrollbar styling to match other windows */
  .numerology-output::-webkit-scrollbar {
    width: 16px;
  }

  .numerology-output::-webkit-scrollbar-track {
    background: #c0c0c0;
    border: 1px inset #888;
  }

  .numerology-output::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border: 1px outset #888;
  }

  .numerology-output::-webkit-scrollbar-thumb:hover {
    background: #d0d0d0;
  }

  .numerology-output::-webkit-scrollbar-button {
    background: #c0c0c0;
    border: 1px outset #888;
    height: 16px;
  }

  .numerology-output::-webkit-scrollbar-button:hover {
    background: #d0d0d0;
  }
</style> 