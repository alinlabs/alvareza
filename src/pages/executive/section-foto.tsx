import React from 'react';
import { EXECUTIVE_PROFILE } from './constants';
import { ExecutiveRunningTicker } from './section-runningtext';

interface ExecutiveProfilePhotoProps {
  isDarkMode?: boolean;
}

export const ExecutiveProfilePhoto: React.FC<ExecutiveProfilePhotoProps> = ({ isDarkMode = false }) => {
  return (
    <div className="order-1 lg:order-2 lg:col-span-4 flex flex-col items-center lg:items-end justify-center w-full relative z-10">
      <div className="relative w-[95%] max-w-[285px] sm:max-w-sm lg:max-w-none lg:w-full flex flex-col items-center lg:items-end lg:ml-auto">
        {/* Running Ticker di Belakang Layer Foto Profil khusus Mobile */}
        <div className="block md:hidden absolute top-[33%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-[130%] z-0 opacity-30 dark:opacity-25 pointer-events-none select-none overflow-hidden scale-125">
          <ExecutiveRunningTicker isDarkMode={isDarkMode} isMobileBackground={true} />
        </div>

        {/* Responsive Desktop/Mobile Profile Photo dengan CSS Mask Image di 30% ujung bawah */}
        <picture className="relative z-10 w-full block [mask-image:linear-gradient(to_bottom,black_70%,rgba(0,0,0,0.85)_77%,rgba(0,0,0,0.5)_86%,rgba(0,0,0,0.15)_94%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,rgba(0,0,0,0.85)_77%,rgba(0,0,0,0.5)_86%,rgba(0,0,0,0.15)_94%,transparent_100%)]">
          <source
            media="(min-width: 1024px)"
            srcSet={EXECUTIVE_PROFILE.desktopPhotoUrl}
          />
          <img
            src={EXECUTIVE_PROFILE.mobilePhotoUrl}
            alt={EXECUTIVE_PROFILE.fullName}
            className="w-full h-auto object-contain object-center lg:object-right select-none block"
            loading="eager"
            fetchPriority="high"
          />
        </picture>

        {/* Gradasi lembut 30% tinggi dari bawah gambar: 100% dark/putih di ujung bawah ke 0% opacity di atasnya */}
        <div
          className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none z-20"
          style={{
            background: isDarkMode
              ? 'linear-gradient(to top, #020617 0%, rgba(2,6,23,0.9) 30%, rgba(2,6,23,0.5) 65%, rgba(2,6,23,0) 100%)'
              : 'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.5) 65%, rgba(255,255,255,0) 100%)',
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
