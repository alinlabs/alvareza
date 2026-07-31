import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ApiService } from '../services/api';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [profileName, setProfileName] = useState('Alvareza Hilka Pratama'); 
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    ApiService.get<any>('profil').then(res => {
      if (res.data && res.data.nama) {
        setProfileName(res.data.nama);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const duration = 5000; // 5 seconds
    const intervalTime = 50; // update every 50ms
    const step = 100 / (duration / intervalTime); // increment step

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onFinish, 300);
          }, 200);
          return 100;
        }
        return p + step; 
      });
    }, intervalTime);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden"
        >
          <div className="flex flex-col items-center z-10 w-full max-w-xs px-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              Digital Profil
            </p>
            
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-[6px] border-white shadow-xl mb-6 bg-slate-50 relative">
              <img src="/gambar/profil.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
            
            <h2 className="text-lg md:text-xl font-bold text-slate-900 text-center">
              {profileName}
            </h2>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1.5 md:h-2 bg-slate-100/50">
            <motion.div 
              className="h-full bg-accent relative overflow-hidden"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.05 }}
            >
              {/* Shimmer effect inside progress bar */}
              <motion.div 
                className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                animate={{ x: ['-100%', '300%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
