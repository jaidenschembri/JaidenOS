<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  function setTheme(theme: string): void {
    document.body.className = '';
    document.body.classList.add(`${theme}-theme`);
    dispatch('close');
  }
</script>

<div id="start-menu" class="start-menu">
  <ul>   

    <li class="submenu-parent">
      Theme ▸
      <ul class="submenu">
        <li on:click={() => setTheme('classic')}>Windows93</li>
        <li on:click={() => setTheme('win98')}>Windows 98</li>
      </ul>
    </li>
    
    <li class="mobile-only-divider">
      <div class="menu-divider"></div>
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
    padding: 6px 10px;
    cursor: pointer;
    transition: background 0.1s ease;
  }

  .start-menu li:hover {
    background: #bfbfbf;
  }

  /* Prevent hover on dividers */
  .start-menu li:has(.menu-divider):hover,
  .start-menu li.mobile-only-divider:hover {
    background: transparent !important;
    cursor: default !important;
    box-shadow: none !important;
  }

  /* ===== SUBMENU ===== */
  .submenu-parent {
    position: relative;
  }

  .submenu-parent:hover .submenu {
    display: block;
  }

  .submenu {
    display: none;
    position: absolute;
    top: -25px;
    left: 130px;
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
    width: 110px;
    z-index: 9999;
  }

  .submenu.open {
    display: block;
  }

  @media (min-width: 769px) {
    .submenu-parent:hover .submenu {
      display: block;
    }
  }

  .submenu li {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    cursor: pointer;
    transition: background 0.1s ease;
  }

  .submenu li:hover {
    background: #bfbfbf;
  }

  /* Position tip submenu */
  .tip-submenu {
    top: -10px !important;
  }

  /* ===== MENU DIVIDERS ===== */
  .menu-divider {
    width: calc(100% - 5px);
    height: 2px;
    background: #c0c0c0;
    box-shadow:
      inset 0 1px #fff,
      inset 0 -1px #888;
    display: block;
  }

  @media (min-width: 769px) {
    .mobile-only-divider {
      display: none !important;
    }
  }
</style> 