<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { windowsStore } from '$lib/stores/windows';
  import WindowWrapper from './WindowWrapper.svelte';
  import { getAssetPath } from '$lib/utils/assets';
  
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
  <div class="portfolio-window">
    <div class="section">
      <h4 class="section-title">Graphics</h4>
      <div class="gallery-grid">
        <img src={getAssetPath('/icons/archive/graphics/bug.png')}>
        <img src={getAssetPath('/icons/archive/graphics/japan.png')}>
        <img src={getAssetPath('/icons/archive/graphics/jc.png')}>
        <img src={getAssetPath('/icons/archive/graphics/KING.png')}>
        <img src={getAssetPath('/icons/archive/graphics/storm.png')}>
        <img src={getAssetPath('/icons/archive/graphics/swag.png')}>
        <img src={getAssetPath('/icons/archive/graphics/vinylenvy1.png')}>
      </div>
    </div>

    <div class="section">
      <h4 class="section-title">Posters / Covers</h4>
      <div class="gallery-grid">
        <img src={getAssetPath('/icons/archive/posters/cassette.png')}>
        <img src={getAssetPath('/icons/archive/posters/concert.png')}>
        <img src={getAssetPath('/icons/archive/posters/flowers-1.png')}>
        <img src={getAssetPath('/icons/archive/posters/flowers-2.png')}>
        <img src={getAssetPath('/icons/archive/posters/flowers-3.png')}>
        <img src={getAssetPath('/icons/archive/posters/flowers-4.png')}>
        <img src={getAssetPath('/icons/archive/posters/hard2reach1.png')}>
        <img src={getAssetPath('/icons/archive/posters/palerider.png')}>
        <img src={getAssetPath('/icons/archive/posters/patty.jpg')}>
        <img src={getAssetPath('/icons/archive/posters/poster.png')}>
      </div>
    </div>

    <div class="section">
      <h4 class="section-title">Apparel</h4>
      <div class="gallery-grid">
        <img src={getAssetPath('/icons/archive/apparel/bikini.png')}>
        <img src={getAssetPath('/icons/archive/apparel/crucifix.png')}>
        <img src={getAssetPath('/icons/archive/apparel/hat2.png')}>
        <img src={getAssetPath('/icons/archive/apparel/hoodie.png')}>
        <img src={getAssetPath('/icons/archive/apparel/mollino.png')}>
        <img src={getAssetPath('/icons/archive/apparel/shaggs.png')}>
        <img src={getAssetPath('/icons/archive/apparel/vintage-1.png')}>
        <img src={getAssetPath('/icons/archive/apparel/vintage-2.png')}>
        <img src={getAssetPath('/icons/archive/apparel/vintage-3.png')}>
      </div>
    </div>

    <div class="section">
      <h4 class="section-title">Objects</h4>
      <div class="gallery-grid">
        <img src={getAssetPath('/icons/archive/objects/table.jpg')}>
      </div>
    </div>
  </div>
</WindowWrapper>

<style>
  /* ===== PORTFOLIO COMPONENT ===== */
  /* Styling for the portfolio window and gallery */

  /* ===== PORTFOLIO LAYOUT ===== */
  .portfolio-window {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    background-color: #c0c0c0;
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

  /* Remove the scrollbar styles since window-content now handles it */
</style> 