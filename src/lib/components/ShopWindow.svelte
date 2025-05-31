<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { windowsStore } from '$lib/stores/windows';
  import WindowWrapper from '$lib/components/WindowWrapper.svelte';
  
  const dispatch = createEventDispatcher();
  
  // ===== CONFIGURATION =====
  const SHOP_CONFIG = {
    items: [
      {
        containerId: 'paypal-button-container-2',
        value: '35.00',
        description: 'HELLGLAM TEE'
      }
    ],
    wallets: {
      ethereum: '0x07017175ac2e3Fe581B7E9B0e89f038166d39c98',
      solana: 'A96xCDmUox8D3hbCNSGXJ6wgMGbB7vV8MxYWGG8EHiae'
    }
  };
  
  let showWalletModal = false;
  
  function handleWindowOpen(event: CustomEvent): void {
    dispatch('open', event.detail);
  }
  
  function handleWindowClose(event: CustomEvent): void {
    dispatch('close', event.detail);
  }
  
  // ===== PAYPAL INTEGRATION =====
  function initializePayPal(): void {
    // Using any type here to avoid complex typing for PayPal SDK
    const paypal = (window as any).paypal;
    
    if (!paypal) {
      console.warn('⚠️ PayPal SDK not loaded');
      return;
    }

    SHOP_CONFIG.items.forEach(item => {
      const container = document.getElementById(item.containerId);
      if (container && !container.hasChildNodes()) {
        paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: { value: item.value },
                description: item.description
              }]
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              alert('✅ Payment complete. Thanks ' + details.payer.name.given_name + '!');
            });
          },
          onError: (err: Error) => {
            console.error('❌ PayPal Error:', err);
            alert('Something went wrong during payment.');
          }
        }).render(`#${item.containerId}`);
      }
    });
  }
  
  // ===== WALLET PAYMENT METHODS =====
  function openMetaMask(): void {
    const addr = SHOP_CONFIG.wallets.ethereum;
    window.open(`https://metamask.app.link/send/${addr}`, "_blank");
  }
  
  function openWalletConnect(): void {
    window.open("https://walletconnect.com/", "_blank");
  }
  
  function openPhantom(): void {
    const addr = SHOP_CONFIG.wallets.solana;
    window.open(`https://phantom.app/ul/send?recipient=${addr}&reference=shop_payment`, "_blank");
  }
  
  function openSolflare(): void {
    const addr = SHOP_CONFIG.wallets.solana;
    window.open(`https://solflare.com/send?recipient=${addr}`, "_blank");
  }
  
  function payWithETH(address: string): void {
    const link = `https://metamask.app.link/send/${address}`;
    window.open(link, '_blank');
  }
  
  function payWithSOL(address: string): void {
    const link = `https://phantom.app/ul/send?recipient=${address}&reference=shop_payment`;
    window.open(link, '_blank');
  }
  
  function toggleWalletModal(): void {
    showWalletModal = !showWalletModal;
  }
  
  function copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  }
  
  onMount(() => {
    // Initialize PayPal on component mount
    initializePayPal();
  });
</script>

<WindowWrapper 
  windowState={$windowsStore['window-shop']}
  on:open={handleWindowOpen}
  on:close={handleWindowClose}
>
  <div class="shop-container"> 
    <div class="shop-item">
      <div class="shop-image-wrapper">
        <img src="/images/sayyestohvn.png" alt="HELLGLAM TEE" class="shop-image" />
      </div>
      <div class="shop-details">
        <h3 class="shop-title">say yes to heaven</h3>
        <p class="shop-desc">100% cotton</p>
        <div class="shop-price">$35.00 USD</div>
        <div id="paypal-button-container-2" style="margin-top: 12px;"></div>
        <button class="crypto-button" on:click={toggleWalletModal}>Pay with Crypto</button>
      </div>
    </div>
  </div>
  
  <!-- Wallet Modal -->
  {#if showWalletModal}
    <div class="wallet-modal" id="wallet-modal">
      <div class="wallet-modal-content">
        <div class="wallet-modal-header">
          <h3>Pay with Cryptocurrency</h3>
          <span class="close-modal" on:click={toggleWalletModal}>&times;</span>
        </div>
        <div class="wallet-modal-body">
          <div class="wallet-section">
            <h4>Ethereum (ETH)</h4>
            <div class="wallet-address">
              <code>{SHOP_CONFIG.wallets.ethereum}</code>
              <button on:click={() => copyToClipboard(SHOP_CONFIG.wallets.ethereum)}>Copy</button>
            </div>
            <div class="wallet-buttons">
              <button on:click={openMetaMask}>MetaMask</button>
              <button on:click={openWalletConnect}>WalletConnect</button>
            </div>
          </div>
          
          <div class="wallet-section">
            <h4>Solana (SOL)</h4>
            <div class="wallet-address">
              <code>{SHOP_CONFIG.wallets.solana}</code>
              <button on:click={() => copyToClipboard(SHOP_CONFIG.wallets.solana)}>Copy</button>
            </div>
            <div class="wallet-buttons">
              <button on:click={openPhantom}>Phantom</button>
              <button on:click={openSolflare}>Solflare</button>
            </div>
          </div>
          
          <p class="wallet-instructions">
            After sending payment, please email a screenshot of the transaction to 
            <a href="mailto:orders@example.com">orders@example.com</a> with your shipping details.
          </p>
        </div>
      </div>
    </div>
  {/if}
</WindowWrapper>

<style>
  /* ===== SHOP COMPONENT ===== */
  /* Styling for the shop window and product display */

  /* ===== WINDOW CONTAINER ===== */
  :global(#window-shop) {
    width: 500px;
    height: 600px;
    max-width: 500px;
    max-height: 725px;
  }

  :global(#window-shop .window-content) {
    flex: 1;
    padding: 0 !important;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: calc(100% - 24px); /* accounts for header */
  }

  /* ===== SHOP LAYOUT ===== */
  .shop-container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    flex-direction: column;
    gap: 20px;
    background-color: #c0c0c0;
  }

  .shop-item {
    width: 100%;
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    gap: 20px;
    border: 2px inset #888;
    background-color: #f0f0f0;
  }

  /* ===== PRODUCT IMAGE ===== */
  .shop-image-wrapper {
    position: relative;
    display: inline-block;
    z-index: 0;
    margin-bottom: 8px;
    flex: 0 0 200px;
    border: 1px solid #888;
    padding: 4px;
    background-color: white;
  }

  .shop-image {
    width: 100%;
    max-width: 350px;
    height: auto;
    margin-bottom: 8px;
  }

  /* ===== PRODUCT INFO ===== */
  .shop-details {
    flex: 1;
    text-align: left;
  }
  
  .shop-title {
    font-size: 24px;
    margin: 0 0 10px 0;
    font-family: 'VT323', monospace;
    color: #000000;
  }

  .shop-desc {
    margin: 0 0 10px 0;
    color: #000;
    font-size: 14px;
    font-family: 'VT323', monospace;
  }

  .shop-price {
    font-size: 20px;
    font-weight: bold;
    color: #000;
    margin-bottom: 15px;
    font-family: 'VT323', monospace;
  }

  /* ===== BUY BUTTON ===== */
  .shop-buy-btn {
    font-size: 14px;
    padding: 8px 16px;
    background-color: #c0c0c0;
    border: 2px outset #f0f0f0;
    cursor: pointer;
    font-family: 'VT323', monospace;
    color: #000;
  }

  .shop-buy-btn:hover {
    background-color: #d0d0d0;
  }

  .shop-buy-btn:active {
    border-style: inset;
  }
  
  .crypto-button {
    margin-top: 15px;
    padding: 8px 15px;
    background-color: #c0c0c0;
    border: 2px outset #f0f0f0;
    cursor: pointer;
    font-family: 'VT323', monospace;
    font-size: 14px;
    color: #000;
  }
  
  .crypto-button:hover {
    background-color: #d0d0d0;
  }

  .crypto-button:active {
    border-style: inset;
  }

  /* ===== WALLET SECTION ===== */
  .wallet-buttons {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .wallet-btn {
    font-size: 11px;
    padding: 6px 12px;
    background: #111;
    color: #0fff95;
    border: 2px solid #0fff95;
    border-radius: 3px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.2s ease;
    box-shadow:
      inset 0 0 0px #0fff95,
      0 0 4px #0fff95,
      0 0 8px #0fff9533;
    display: block;
    width: 100%;
    margin: 6px 0;
    padding: 8px 10px;
  }

  .wallet-btn:hover {
    background: #0fff95;
    color: #000;
    box-shadow:
      0 0 4px #0fff95,
      0 0 12px #0fff95aa;
  }

  /* ===== WALLET MODAL ===== */
  .wallet-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .wallet-modal.hidden {
    display: none;
  }

  .wallet-modal-content {
    background-color: #f0f0f0;
    border: 2px solid #000080;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .wallet-modal-header {
    background-color: #000080;
    color: white;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .wallet-modal-header h3 {
    margin: 0;
    font-size: 18px;
  }

  .close-modal {
    font-size: 24px;
    cursor: pointer;
  }

  .wallet-modal-body {
    padding: 15px;
  }

  .wallet-section {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ccc;
  }

  .wallet-section h4 {
    margin-top: 0;
    margin-bottom: 10px;
  }

  .wallet-address {
    display: flex;
    background-color: #e0e0e0;
    padding: 8px;
    margin-bottom: 10px;
    font-size: 12px;
    align-items: center;
    border: 1px solid #ccc;
  }

  .wallet-address code {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .wallet-address button {
    margin-left: 5px;
    padding: 2px 5px;
    background-color: #c0c0c0;
    border: 1px solid #999;
    cursor: pointer;
    font-size: 12px;
  }

  .wallet-buttons button {
    flex: 1;
    padding: 8px;
    background-color: #c0c0c0;
    border: 2px outset #f0f0f0;
    cursor: pointer;
  }

  .wallet-buttons button:active {
    border-style: inset;
  }

  .wallet-instructions {
    font-size: 14px;
    margin-top: 20px;
    padding: 10px;
    background-color: #e0e0e0;
    border: 1px solid #ccc;
  }
</style> 