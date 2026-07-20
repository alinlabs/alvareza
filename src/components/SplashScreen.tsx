import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ApiService } from '../services/api';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState(0); 
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
    const t1 = setTimeout(() => setPhase(1), 2000); 
    const t2 = setTimeout(() => setPhase(2), 3200); 
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (phase === 2) {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsVisible(false);
              setTimeout(onFinish, 800);
            }, 600);
            return 100;
          }
          return p + 1.2; 
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [phase, onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden"
        >
          <AnimatePresence>
            {phase === 0 && (
              <motion.div
                key="blue-bg"
                initial={{ clipPath: 'circle(150% at 50% 50%)' }}
                exit={{ clipPath: 'circle(0% at 50% 50%)' }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0 bg-accent flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: -20 }}
                  transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                  className="text-center text-white"
                >
                  <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2"
                  >
                    Welcome
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-sm md:text-base font-medium tracking-widest uppercase"
                  >
                    Digital Profile
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === 2 && (
              <>
                <motion.div
                  key="profile-content"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
                  className="flex flex-col items-center z-10 w-full max-w-xs px-6"
                >
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6"
                  >
                    Digital Profil
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 120, damping: 20 }}
                    className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-[6px] border-white shadow-xl mb-6 bg-slate-50 relative"
                  >
                    <img src="/gambar/profil.png" alt="Profile" className="w-full h-full object-cover" />
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-lg md:text-xl font-bold text-slate-900 text-center"
                  >
                    {profileName}
                  </motion.h2>
                </motion.div>

                <motion.div 
                  key="progress-bar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute bottom-0 left-0 right-0 h-1.5 md:h-2 bg-slate-100/50"
                >
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
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
