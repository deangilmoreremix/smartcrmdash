/**
 * Performance Metrics Utility
 * Tracks animation performance metrics for optimization
 *
 * Tracks:
 * - Load time
 * - Frames per second (FPS)
 * - Interaction response time
 * - Animation smoothness
 */

export interface AnimationMetrics {
  component: string;
  loadTime: number;
  fps: number;
  interactionDelay: number;
  frameDrops: number;
}

const metrics: Record<string, AnimationMetrics> = {};
let frameCount = 0;
let lastFrameTime = performance.now();
let frameDrops = 0;

export const startPerformanceTracking = (componentName: string): {
  endTracking: () => void;
  trackInteraction: () => { endInteraction: () => void };
} => {
  const startTime = performance.now();
  
  // Initialize component metrics with default values
  const initMetrics: AnimationMetrics = {
    component: componentName,
    loadTime: 0,
    fps: 0,
    interactionDelay: 0,
    frameDrops: 0
  };
  metrics[componentName] = initMetrics;

  // Start FPS tracking
  const fps = trackFPS();
  
  return {
    endTracking: () => {
      const currentMetrics = metrics[componentName] || initMetrics;
      currentMetrics.loadTime = performance.now() - startTime;
      currentMetrics.fps = fps();
      currentMetrics.frameDrops = frameDrops;
    },
    trackInteraction: () => {
      const interactionStart = performance.now();
      
      return {
        endInteraction: () => {
          const currentMetrics = metrics[componentName] || initMetrics;
          currentMetrics.interactionDelay = performance.now() - interactionStart;
        }
      };
    }
  };
};

const trackFPS = (): () => number => {
  let fps = 60;
  let lastTime = performance.now();
  let frames = 0;
  let lastFpsUpdate = lastTime;

  const checkFPS = () => {
    const now = performance.now();
    frames++;
    
    // Check for frame drops
    if (now > lastFrameTime + 32) { // 16.67ms is ~60fps, so 32ms indicates a dropped frame
      frameDrops++;
    }
    lastFrameTime = now;

    // Update FPS calculation every second
    if (now > lastFpsUpdate + 1000) {
      fps = Math.round((frames * 1000) / (now - lastFpsUpdate));
      frames = 0;
      lastFpsUpdate = now;
    }

    requestAnimationFrame(checkFPS);
  };

  requestAnimationFrame(checkFPS);

  return () => fps;
};

export const getPerformanceMetrics = (): Record<string, AnimationMetrics> => metrics;
export const resetMetrics = (): void => {
  Object.keys(metrics).forEach(key => delete metrics[key]);
  frameDrops = 0;
};