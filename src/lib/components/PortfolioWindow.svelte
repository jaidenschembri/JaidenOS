<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { windowsStore } from '$lib/stores/windows';
  import WindowWrapper from '$lib/components/WindowWrapper.svelte';
  
  const dispatch = createEventDispatcher();
  
  function handleWindowOpen(event: CustomEvent): void {
    dispatch('open', event.detail);
  }
  
  function handleWindowClose(event: CustomEvent): void {
    dispatch('close', event.detail);
  }
  
  function openLightbox(imgSrc: string): void {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement;
    
    if (lightbox && lightboxImg) {
      lightboxImg.src = imgSrc;
      lightbox.classList.remove('hidden');
    }
  }
</script>

<WindowWrapper 
  windowState={$windowsStore['window-portfolio']}
  on:open={handleWindowOpen}
  on:close={handleWindowClose}
>
  <div class="portfolio-scroll-wrapper">
    <div class="portfolio-window">
      <div class="section">
        <h4 class="section-title">Graphics</h4>
        <div class="gallery-grid">
          <img src="/icons/archive/graphics/bug.png">
          <img src="/icons/archive/graphics/japan.png">
          <img src="/icons/archive/graphics/jc.png">
          <img src="/icons/archive/graphics/KING.png">
          <img src="/icons/archive/graphics/storm.png">
          <img src="/icons/archive/graphics/swag.png">
          <img src="/icons/archive/graphics/vinylenvy1.png">
        </div>
      </div>

      <div class="section">
        <h4 class="section-title">Posters / Covers</h4>
        <div class="gallery-grid">
          <img src="/icons/archive/posters/cassette.png">
          <img src="/icons/archive/posters/concert.png">
          <img src="/icons/archive/posters/flowers-1.png">
          <img src="/icons/archive/posters/flowers-2.png">
          <img src="/icons/archive/posters/flowers-3.png">
          <img src="/icons/archive/posters/flowers-4.png">
          <img src="/icons/archive/posters/hard2reach1.png">
          <img src="/icons/archive/posters/palerider.png">
          <img src="/icons/archive/posters/patty.jpg">
          <img src="/icons/archive/posters/poster.png">
        </div>
      </div>

      <div class="section">
        <h4 class="section-title">Apparel</h4>
        <div class="gallery-grid">
          <img src="/icons/archive/apparel/bikini.png">
          <img src="/icons/archive/apparel/crucifix.png">
          <img src="/icons/archive/apparel/hat2.png">
          <img src="/icons/archive/apparel/hoodie.png">
          <img src="/icons/archive/apparel/mollino.png">
          <img src="/icons/archive/apparel/shaggs.png">
          <img src="/icons/archive/apparel/vintage-1.png">
          <img src="/icons/archive/apparel/vintage-2.png">
          <img src="/icons/archive/apparel/vintage-3.png">
        </div>
      </div>

      <div class="section">
        <h4 class="section-title">Objects</h4>
        <div class="gallery-grid">
          <img src="/icons/archive/objects/table.jpg">
        </div>
      </div>
    </div>
    <div class="portfolio-fade"></div>
  </div>
</WindowWrapper>

<style>
  /* ===== PORTFOLIO COMPONENT ===== */
  /* Styling for the portfolio window and gallery */

  /* ===== WINDOW CONTAINER ===== */
  :global(#window-portfolio) {
    position: absolute;
    left: 50%;
    top: 10%;
    width: 800px;
    height: 600px;
    max-width: none;
    max-height: none;
    overflow: auto;
    display: flex;
    flex-direction: column;
    background: #e0e0e0;
    z-index: 100;
    box-sizing: border-box;
    pointer-events: auto;
  }

  /* ===== WINDOW HEADER ===== */
  :global(.window-header) {
    background: #c0c0c0;
    padding: 6px 10px;
    font-family: 'VT323', monospace;
    font-size: 14px;
    border-bottom: 1px solid #666;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    top: 0;
    z-index: 10;
    pointer-events: auto;
    cursor: move !important;
  }

  /* ===== WINDOW CONTENT ===== */
  :global(.window-content) {
    flex: 1;
    overflow-y: scroll;
    box-sizing: border-box;
  }

  /* ===== PORTFOLIO LAYOUT ===== */
  .portfolio-scroll-wrapper {
    position: relative;
    height: 100%;
    overflow-y: auto;
    padding: 20px;
    background-color: #c0c0c0;
  }
  
  .portfolio-window {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  /* ===== PORTFOLIO SECTIONS ===== */
  .section {
    margin-bottom: 32px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .section-title {
    font-family: 'VT323', monospace;
    font-size: 20px;
    color: #000;
    margin: 0;
    text-transform: uppercase;
    border-bottom: 1px dashed #888;
    padding-bottom: 6px;
  }

  /* ===== GALLERY GRID ===== */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
    place-items: center;
    padding: 10px;
  }

  .gallery-grid img {
    max-width: 100%;
    max-height: 140px;
    width: auto;
    height: auto;
    object-fit: contain;
    cursor: pointer;
    padding: 2px;
  }
  
  .portfolio-fade {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: linear-gradient(transparent, #c0c0c0);
    pointer-events: none;
  }

  /* Retro scrollbar styling */
  .portfolio-scroll-wrapper::-webkit-scrollbar {
    width: 16px;
  }

  .portfolio-scroll-wrapper::-webkit-scrollbar-track {
    background: #c0c0c0;
    border: 1px inset #888;
  }

  .portfolio-scroll-wrapper::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border: 1px outset #888;
  }

  .portfolio-scroll-wrapper::-webkit-scrollbar-thumb:hover {
    background: #d0d0d0;
  }

  .portfolio-scroll-wrapper::-webkit-scrollbar-button {
    background: #c0c0c0;
    border: 1px outset #888;
    height: 16px;
  }

  .portfolio-scroll-wrapper::-webkit-scrollbar-button:hover {
    background: #d0d0d0;
  }
</style> 