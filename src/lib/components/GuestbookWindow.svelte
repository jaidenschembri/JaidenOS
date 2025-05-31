<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { windowsStore } from '$lib/stores/windows';
  import WindowWrapper from '$lib/components/WindowWrapper.svelte';
  
  // Firebase - using type any to avoid TypeScript errors with dynamic loading
  let firebase: any;
  let db: any;
  let unsubscribe: Function | null = null;
  
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyB4gYXMt5cBXQc4v7-dSn81Nkzv4G82lkU",
    authDomain: "neocity-486f6.firebaseapp.com",
    projectId: "neocity-486f6",
    storageBucket: "neocity-486f6.appspot.com",
    messagingSenderId: "306365741510",
    appId: "1:306365741510:web:68919ebfa94e2eab279ac7",
    measurementId: "G-S63FZYBK5J"
  };
  
  interface FirebaseTimestamp {
    toDate: () => Date;
    toMillis: () => number;
  }
  
  interface GuestbookEntry {
    id?: string;
    name: string;
    message: string;
    timestamp?: FirebaseTimestamp;
  }
  
  let name = '';
  let message = '';
  let entries: GuestbookEntry[] = [];
  let isInitialized = false;
  
  // Initialize Firebase using browser-compatible script tags
  async function initializeFirebase(): Promise<void> {
    try {
      // Create script elements for Firebase
      const loadScript = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
          document.head.appendChild(script);
        });
      };
      
      // Load Firebase scripts (using browser CDN versions, not module versions)
      await loadScript('https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore-compat.js');
      
      // Access Firebase from the global window object
      const firebaseApp = (window as any).firebase;
      
      // Initialize Firebase app
      firebaseApp.initializeApp(firebaseConfig);
      
      // Get Firestore instance
      db = firebaseApp.firestore();
      
      // Store Firebase functions we need
      firebase = {
        collection: (path: string) => db.collection(path),
        addDoc: (ref: any, data: any) => ref.add(data),
        serverTimestamp: () => firebaseApp.firestore.FieldValue.serverTimestamp(),
        onSnapshot: (ref: any, callback: any) => ref.onSnapshot(callback)
      };
      
      isInitialized = true;
      
      // Load entries once Firebase is initialized
      loadEntries();
    } catch (error) {
      console.error("Error initializing Firebase:", error);
    }
  }
  
  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    if (!isInitialized || !name.trim() || !message.trim()) return;
    
    try {
      const guestbookRef = firebase.collection("guestbook");
      await firebase.addDoc(guestbookRef, {
        name: name.trim(),
        message: message.trim(),
        timestamp: firebase.serverTimestamp()
      });
      
      // Reset form
      name = '';
      message = '';
    } catch (error) {
      console.error("Error adding message:", error);
    }
  }
  
  function formatDate(timestamp: FirebaseTimestamp | undefined): string {
    if (!timestamp || !timestamp.toDate) return 'Just now';
    
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  function loadEntries(): void {
    if (!isInitialized) return;
    
    const guestbookRef = firebase.collection("guestbook");
    
    unsubscribe = firebase.onSnapshot(guestbookRef, (snapshot: any) => {
      const newEntries: GuestbookEntry[] = [];
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        newEntries.push({
          id: doc.id,
          name: data.name,
          message: data.message,
          timestamp: data.timestamp
        });
      });
      
      // Sort entries by timestamp (newest first)
      entries = newEntries.sort((a, b) => {
        const timeA = a.timestamp ? a.timestamp.toMillis() : 0;
        const timeB = b.timestamp ? b.timestamp.toMillis() : 0;
        return timeB - timeA;
      });
    });
  }
  
  onMount(() => {
    initializeFirebase();
  });
  
  onDestroy(() => {
    // Clean up the snapshot listener when the component is destroyed
    if (unsubscribe) {
      unsubscribe();
    }
  });
</script>

<WindowWrapper windowState={$windowsStore['guestbook']}>
  <div class="guestbook-container">
    <form id="guestbookForm" class="guestbook-form" on:submit={handleSubmit}>
      <input 
        type="text" 
        id="name" 
        placeholder="Your name" 
        required 
        bind:value={name}
      />
      <textarea 
        id="message" 
        placeholder="Your message..." 
        rows="3" 
        required 
        bind:value={message}
      ></textarea>
      <button type="submit">Sign Guestbook</button>
    </form>
    <hr />
    <ul id="entriesList" class="guestbook-entries">
      {#each entries as entry (entry.id)}
        <li class="entry">
          <div class="entry-header">
            <strong>{entry.name}</strong>
            <span class="entry-date">{formatDate(entry.timestamp)}</span>
          </div>
          <p>{entry.message}</p>
        </li>
      {/each}
    </ul>
  </div>
</WindowWrapper>

<style>
  .guestbook-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 15px;
    background-color: #c0c0c0;
    box-sizing: border-box;
  }
  
  .guestbook-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 2px inset #888;
    background-color: #f0f0f0;
    margin-bottom: 10px;
  }
  
  .guestbook-form input,
  .guestbook-form textarea {
    padding: 8px;
    border: 2px inset #888;
    background-color: white;
    color: #000;
    font-family: 'VT323', monospace;
    font-size: 14px;
  }
  
  .guestbook-form textarea {
    resize: vertical;
  }
  
  .guestbook-form button {
    padding: 8px 16px;
    background-color: #c0c0c0;
    border: 2px outset #f0f0f0;
    cursor: pointer;
    font-family: 'VT323', monospace;
    font-size: 14px;
    color: #000;
    align-self: flex-end;
  }

  .guestbook-form button:hover {
    background-color: #d0d0d0;
  }
  
  .guestbook-form button:active {
    border-style: inset;
  }
  
  hr {
    border: none;
    border-top: 1px solid #888;
    margin: 8px 0;
  }
  
  .guestbook-entries {
    list-style: none;
    padding: 15px;
    margin: 0;
    overflow-y: auto;
    flex: 1;
    background-color: white;
    border: 2px inset #888;
    font-family: 'VT323', monospace;
    font-size: 14px;
    color: #000;
    height: calc(100% - 160px);
  }
  
  .entry {
    border: 1px solid #888;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f0f0f0;
  }
  
  .entry-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
  }
  
  .entry-date {
    color: #666;
    font-size: 12px;
    font-weight: normal;
  }

  /* Retro scrollbar styling */
  .guestbook-entries::-webkit-scrollbar {
    width: 16px;
  }

  .guestbook-entries::-webkit-scrollbar-track {
    background: #c0c0c0;
    border: 1px inset #888;
  }

  .guestbook-entries::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border: 1px outset #888;
  }

  .guestbook-entries::-webkit-scrollbar-thumb:hover {
    background: #d0d0d0;
  }

  .guestbook-entries::-webkit-scrollbar-button {
    background: #c0c0c0;
    border: 1px outset #888;
    height: 16px;
  }

  .guestbook-entries::-webkit-scrollbar-button:hover {
    background: #d0d0d0;
  }
</style> 