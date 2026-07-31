import React, { useState, useEffect } from 'react';
import { Eye, Loader2, Globe } from 'lucide-react';

interface PortfolioImageProps {
  src: string;
  alt: string;
  kategori: string;
  className?: string;
  onClick?: () => void;
  showHoverOverlay?: boolean;
  forceMobile?: boolean;
}

export function PortfolioImage({
  src,
  alt,
  kategori,
  className = "w-full h-full object-cover",
  onClick,
  showHoverOverlay = false,
  forceMobile = false
}: PortfolioImageProps) {
  const isWebThumbnail = src.includes('thum.io');
  
  let finalSrc = src;
  if (forceMobile && isWebThumbnail) {
    if (src.includes('thum.io')) {
      const match = src.match(/thum\.io\/get\/(?:.*\/)?(https?:\/\/.*)/);
      if (match && match[1]) {
        finalSrc = `https://image.thum.io/get/viewportWidth/400/width/400/crop/800/${match[1]}`;
      } else {
        finalSrc = src.replace('width/1280/crop/800', 'viewportWidth/400/width/400/crop/800');
      }
    } else if (src.startsWith('http')) {
      finalSrc = `https://image.thum.io/get/viewportWidth/400/width/400/crop/800/${src}`;
    }
  }

  const cacheKey = `thum_loaded_${finalSrc}`;
  const isCached = React.useMemo(() => {
    try {
      return localStorage.getItem(cacheKey) === 'true';
    } catch {
      return false;
    }
  }, [cacheKey]);

  const [countdown, setCountdown] = useState(isWebThumbnail && !isCached ? 7 : 0);
  const [imageLoaded, setImageLoaded] = useState(isCached);

  useEffect(() => {
    if (!isWebThumbnail) return;
    
    // If already cached, skip countdown entirely
    if (localStorage.getItem(cacheKey) === 'true') {
      setCountdown(0);
      setImageLoaded(true);
      return;
    }
    
    // Reset states if finalSrc changes and not cached
    setCountdown(7);
    setImageLoaded(false);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [finalSrc, isWebThumbnail, cacheKey]);

  if (isWebThumbnail && countdown > 0) {
    return (
      <div className="relative w-full h-full min-h-[180px] bg-slate-950 flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden">
        {/* Modern abstract animated background lines/grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        {/* Circular Countdown Progress Indicator */}
        <div className="relative w-16 h-16 flex items-center justify-center mb-3 z-10">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              className="stroke-slate-850/80 fill-none"
              strokeWidth="3"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              className="stroke-blue-500 fill-none transition-all duration-1000"
              strokeWidth="3"
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={2 * Math.PI * 28 * (1 - countdown / 7)}
            />
          </svg>
          <span className="text-sm font-black text-white">{countdown}s</span>
        </div>

        <div className="space-y-1 z-10">
          <p className="text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5">
            <Globe className="w-3.5 h-3.5 animate-spin text-blue-400" />
            Menyiapkan Pratinjau Website
          </p>
          <p className="text-[10px] text-slate-400 max-w-[200px] leading-tight mx-auto">
            Menunggu splash screen website selesai memuat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden" onClick={onClick}>
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        className={`${className} ${isWebThumbnail && !imageLoaded ? 'blur-md' : 'blur-0'} transition-all duration-500`}
        onLoad={() => {
          setImageLoaded(true);
          if (isWebThumbnail) {
            try {
              localStorage.setItem(cacheKey, 'true');
            } catch (e) {
              console.error(e);
            }
          }
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
        }}
      />
      
      {/* If it's a web thumbnail and still loading the image after the 7 seconds */}
      {isWebThumbnail && !imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
        </div>
      )}

      {showHoverOverlay && (
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <span className="text-white text-sm font-medium tracking-wider flex items-center gap-1.5 transition-transform duration-300 scale-95 group-hover:scale-100">
            <Eye className="w-4 h-4" /> Detail Proyek
          </span>
        </div>
      )}
    </div>
  );
}
