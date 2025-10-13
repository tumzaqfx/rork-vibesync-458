import { Platform } from 'react-native';

class FPSMonitor {
  private frameCount: number = 0;
  private lastTime: number = Date.now();
  private fps: number = 60;
  private rafId: number | null = null;
  private enabled: boolean = false;
  private callbacks: Set<(fps: number) => void> = new Set();

  start(): void {
    if (this.enabled || Platform.OS !== 'web') return;

    this.enabled = true;
    this.frameCount = 0;
    this.lastTime = Date.now();
    this.loop();
  }

  stop(): void {
    this.enabled = false;
    if (this.rafId !== null && Platform.OS === 'web') {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private loop = (): void => {
    if (!this.enabled) return;

    this.frameCount++;
    const currentTime = Date.now();
    const elapsed = currentTime - this.lastTime;

    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.lastTime = currentTime;

      this.callbacks.forEach(callback => callback(this.fps));

      if (this.fps < 30) {
        console.warn(`[FPS Monitor] Low FPS detected: ${this.fps}`);
      }
    }

    if (Platform.OS === 'web') {
      this.rafId = requestAnimationFrame(this.loop);
    }
  };

  getFPS(): number {
    return this.fps;
  }

  subscribe(callback: (fps: number) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

export const fpsMonitor = new FPSMonitor();
