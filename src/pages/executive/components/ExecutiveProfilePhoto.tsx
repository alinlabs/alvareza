import React from 'react';
import { EXECUTIVE_PROFILE } from '../constants';

export const ExecutiveProfilePhoto: React.FC = () => {
  return (
    <div className="order-1 lg:order-2 lg:col-span-4 flex flex-col items-center lg:items-end justify-center w-full">
      <div className="relative w-[95%] max-w-[285px] sm:max-w-sm lg:max-w-none lg:w-full flex flex-col items-center lg:items-end lg:ml-auto">
        {/* Responsive Desktop/Mobile Profile Photo dengan CSS Mask Image di 30% ujung bawah */}
        <picture className="w-full block [mask-image:linear-gradient(to_bottom,black_70%,rgba(0,0,0,0.85)_77%,rgba(0,0,0,0.5)_86%,rgba(0,0,0,0.15)_94%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,rgba(0,0,0,0.85)_77%,rgba(0,0,0,0.5)_86%,rgba(0,0,0,0.15)_94%,transparent_100%)]">
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

        {/* Gradasi lembut 30% tinggi dari bawah gambar: 100% putih di ujung bawah ke 0% opacity di atasnya */}
        <div
          className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none z-10 [background:linear-gradient(to_top,#ffffff_0%,rgba(255,255,255,0.85)_25%,rgba(255,255,255,0.5)_55%,rgba(255,255,255,0.15)_80%,rgba(255,255,255,0)_100%)]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
