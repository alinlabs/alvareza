import React, { useEffect, useRef, useState } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

export interface LottiePlayerProps {
  /** The parsed animation JSON object */
  animationData?: any;
  /** Convenience prop accepting either an object (animationData) or string URL (path) */
  src?: any;
  /** Path or URL to animation JSON file */
  path?: string;
  /** Whether the animation should loop continuously */
  loop?: boolean;
  /** Whether the animation should autoplay on mount */
  autoplay?: boolean;
  /** Additional CSS class names for the container */
  className?: string;
  /** Playback speed (default 1) */
  speed?: number;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** Optional custom fallback element while loading */
  fallback?: React.ReactNode;
}

export const LottiePlayer: React.FC<LottiePlayerProps> = ({
  animationData,
  src,
  path,
  loop = true,
  autoplay = true,
  className = 'w-full h-full',
  speed = 1,
  style,
  fallback,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Destroy existing animation before creating a new one
    if (animRef.current) {
      try {
        animRef.current.destroy();
      } catch {
        // ignore
      }
      animRef.current = null;
    }

    container.innerHTML = '';

    const rawData = animationData || (typeof src === 'object' && src !== null ? src : undefined);
    const pathToLoad = path || (typeof src === 'string' ? src : undefined);

    if (!rawData && !pathToLoad) return;

    // Safely unwrap ESM module default export if present
    const unwrappedData = rawData?.layers
      ? rawData
      : (rawData?.default?.layers ? rawData.default : rawData);

    try {
      // Deep clone animationData to prevent frozen-object mutations by lottie-web
      const safeData = unwrappedData ? JSON.parse(JSON.stringify(unwrappedData)) : undefined;

      const playerInstance = (lottie as any).default || lottie;
      const anim = playerInstance.loadAnimation({
        container,
        renderer: 'svg',
        loop,
        autoplay,
        animationData: safeData,
        path: pathToLoad,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
          clearCanvas: true,
          progressiveLoad: false,
          hideOnTransparent: false,
          className: 'w-full h-full block',
        },
      });

      if (speed !== 1 && typeof anim.setSpeed === 'function') {
        anim.setSpeed(speed);
      }

      anim.addEventListener('DOMLoaded', () => {
        setIsReady(true);
        if (autoplay && typeof anim.play === 'function') {
          anim.play();
        }
      });

      anim.addEventListener('data_ready', () => {
        setIsReady(true);
        if (autoplay && typeof anim.play === 'function') {
          anim.play();
        }
      });

      // Mark ready immediately if loaded from direct object
      if (safeData) {
        setIsReady(true);
      }

      animRef.current = anim;
    } catch (err) {
      console.warn('Lottie player initialization error:', err);
    }

    return () => {
      if (animRef.current) {
        try {
          animRef.current.destroy();
        } catch {
          // ignore
        }
        animRef.current = null;
      }
    };
  }, [animationData, src, path, loop, autoplay, speed]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        ...style,
      }}
    >
      {/* Fallback while loading */}
      {!isReady && fallback && (
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          {fallback}
        </div>
      )}

      {/* Lottie SVG Container */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
