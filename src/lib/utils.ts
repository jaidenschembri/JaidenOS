/**
 * Collection of utility functions for the desktop OS theme
 */

/**
 * Ensures a value is within a specified range
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

/**
 * Throttles a function to limit how often it can be called
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T, 
  limit: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let inThrottle = false;
  let lastResult: ReturnType<T>;
  
  return function(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    if (!inThrottle) {
      lastResult = func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    
    return lastResult;
  };
}

/**
 * Debounces a function to delay its execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return function(this: any, ...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return `id-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Checks if an element is visible in the viewport
 */
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Formats a date in a consistent way
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Classic Windows Sound Effects
export class WindowsSounds {
  private static audioContext: AudioContext | null = null;

  static init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  static playStartupSound() {
    this.playTone([523, 659, 784, 1047], [0.2, 0.2, 0.2, 0.4], 0.1);
  }

  static playClickSound() {
    this.playTone([800], [0.05], 0.05);
  }

  static playNotificationSound() {
    this.playTone([523, 659], [0.1, 0.2], 0.08);
  }

  private static playTone(frequencies: number[], durations: number[], volume: number = 0.1) {
    if (!this.audioContext) return;

    let startTime = this.audioContext.currentTime;

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.setValueAtTime(freq, startTime);
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + durations[index]);

      oscillator.start(startTime);
      oscillator.stop(startTime + durations[index]);

      startTime += durations[index];
    });
  }
}

// Initialize sounds when module loads
if (typeof window !== 'undefined') {
  WindowsSounds.init();
}

/**
 * Mobile and responsive utilities
 */
export const ResponsiveUtils = {
  /**
   * Check if the current device is mobile
   */
  isMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  },

  /**
   * Check if the current device is tablet
   */
  isTablet(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  },

  /**
   * Check if the current device is desktop
   */
  isDesktop(): boolean {
    if (typeof window === 'undefined') return true;
    return window.innerWidth > 1024;
  },

  /**
   * Get mobile-optimized window dimensions
   */
  getMobileWindowSize(defaultWidth: number, defaultHeight: number): { width: number; height: number } {
    if (typeof window === 'undefined') {
      return { width: defaultWidth, height: defaultHeight };
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (this.isMobile()) {
      return {
        width: Math.min(defaultWidth, viewportWidth - 20),
        height: Math.min(defaultHeight, viewportHeight - 100)
      };
    }
    
    if (this.isTablet()) {
      return {
        width: Math.min(defaultWidth, viewportWidth - 60),
        height: Math.min(defaultHeight, viewportHeight - 120)
      };
    }
    
    return { width: defaultWidth, height: defaultHeight };
  },

  /**
   * Get mobile-optimized position for centering
   */
  getMobilePosition(windowWidth: number, windowHeight: number): { x: number; y: number } {
    if (typeof window === 'undefined') {
      return { x: 100, y: 100 };
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (this.isMobile()) {
      return {
        x: Math.max(5, (viewportWidth - windowWidth) / 2),
        y: Math.max(10, (viewportHeight - windowHeight) / 2)
      };
    }
    
    return {
      x: Math.max(0, (viewportWidth - windowWidth) / 2),
      y: Math.max(0, (viewportHeight - windowHeight) / 2)
    };
  },

  /**
   * Check if device supports touch
   */
  isTouchDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  /**
   * Get safe area insets for mobile devices with notches
   */
  getSafeAreaInsets(): { top: number; bottom: number; left: number; right: number } {
    if (typeof window === 'undefined' || typeof getComputedStyle === 'undefined') {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    const style = getComputedStyle(document.documentElement);
    return {
      top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
      bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
      left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0'),
      right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0')
    };
  },

  /**
   * Debounce function for resize events
   */
  debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}; 