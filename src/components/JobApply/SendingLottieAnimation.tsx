import React from 'react';
import { LottiePlayer } from '../common/LottiePlayer';
import emailSendingAnimationData from '../../assets/emailSendingLottie.json';

interface SendingLottieAnimationProps {
  className?: string;
  senderEmail?: string;
}

export const SendingLottieAnimation: React.FC<SendingLottieAnimationProps> = ({
  className = 'w-48 h-48 sm:w-56 sm:h-56',
  senderEmail,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-2 text-center select-none">
      {/* Animated Sending Visual Container */}
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* Ambient Glow Background */}
        <div className="absolute inset-4 rounded-full bg-blue-500/10 blur-xl animate-pulse pointer-events-none" />

        {/* Lottie Player Layer */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <LottiePlayer
            animationData={emailSendingAnimationData}
            loop={true}
            autoplay={true}
            className="w-full h-full"
            fallback={
              /* Rich SVG Dynamic Flight Fallback */
              <div className="relative w-full h-full flex items-center justify-center">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full overflow-visible"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Radar Ripple Rings */}
                  <circle
                    cx="100"
                    cy="100"
                    r="45"
                    className="animate-ping text-blue-200/50"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{ animationDuration: '2.5s' }}
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    className="text-blue-100/60"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />

                  {/* Flight Dashed Contrail */}
                  <path
                    d="M 40 140 Q 75 125 100 100 T 150 55"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="2.5"
                    strokeDasharray="5,4"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />

                  {/* Floating Paper Airplane with Shadow */}
                  <g className="animate-bounce" style={{ animationDuration: '2s' }}>
                    {/* Plane Shadow */}
                    <ellipse cx="100" cy="148" rx="28" ry="6" fill="#1E293B" opacity="0.08" />

                    {/* Paper Airplane */}
                    <g transform="translate(100, 95) rotate(-15) scale(0.95)">
                      {/* Left Wing */}
                      <polygon points="0,-45 -48,22 0,10" fill="#2563EB" />
                      {/* Right Wing */}
                      <polygon points="0,-45 48,22 0,10" fill="#3B82F6" />
                      {/* Center Fold / Fuselage */}
                      <polygon points="0,-45 0,30 -10,10" fill="#1D4ED8" />
                      {/* Inner Wing Shadow */}
                      <polygon points="0,-45 10,10 0,30" fill="#1E40AF" />
                    </g>
                  </g>
                </svg>
              </div>
            }
          />
        </div>
      </div>

      {/* Main Title */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2 tracking-tight flex items-center gap-1.5 justify-center">
        <span>Mengirimkan Lamaran</span>
        <span className="inline-flex gap-0.5">
          <span className="w-1 h-1 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1 h-1 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1 h-1 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      </h3>

      {/* Subtitle with sender email */}
      <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-[280px] truncate">
        Via {senderEmail || 'Google Apps Script'}
      </p>
    </div>
  );
};


