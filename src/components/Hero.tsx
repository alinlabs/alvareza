import { ApiService } from '../services/api';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MessageCircle, Instagram, BadgeCheck } from 'lucide-react';
import { ProfileData } from '../types';

export default function Hero() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    ApiService.get<any>('profil').then(res => res.data)
      .then(data => setProfile(data))
      .catch(err => console.error("Failed to load profil data", err));
  }, []);

  if (!profile) return null;

  return (
    <section className="relative bg-white dark:bg-slate-950 pb-8 md:pb-12">
      {/* Cover Image - 4:3 on mobile, 3:1 on desktop */}
      <div className="w-full aspect-[4/3] lg:aspect-[3/1] relative overflow-hidden">
        <picture>
          <source media="(min-width: 1024px)" srcSet="/gambar/hero-desktop.webp" />
          <img 
            src="/gambar/hero-mobile.webp" 
            alt="Cover Image" 
            className="w-full h-full object-cover"
          />
        </picture>
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 to-transparent"></div>
      </div>

      {/* Floating Card Container */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-20 md:-mt-12 lg:-mt-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-transparent md:bg-white dark:bg-slate-950 md:rounded-3xl md:border md:border-slate-100 dark:border-slate-800 md:shadow-[0_20px_50px_rgba(2,34,126,0.06)] p-0 md:p-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
            {/* Profile Image Column */}
            <div className="flex-shrink-0 -mt-20 md:-mt-24 relative flex justify-center w-full md:w-auto">
              <div className="relative group">
                <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-[6px] border-white dark:border-slate-950 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
                  <img 
                    src="/gambar/profil.png" 
                    alt={profile.nama} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Active/Verified Badge */}
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-9 h-9 sm:w-11 sm:h-11 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center shadow-[0_4px_10px_rgb(0,0,0,0.12)] border-2 border-white dark:border-slate-950">
                  <BadgeCheck className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 fill-blue-600 stroke-white" />
                </div>
              </div>
            </div>

            {/* Profile details and Contacts Column */}
            <div className="flex-grow w-full text-center md:text-left pt-2 md:pt-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                
                {/* Name, Title, and Badge */}
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 justify-center md:justify-start flex-wrap">
                    <h1 className="text-[20px] sm:text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-slate-50 tracking-tight leading-none">
                      {profile.nama}
                    </h1>
                  </div>
                  
                  <p className="text-lg md:text-xl font-semibold text-slate-700 dark:text-slate-300">
                    {profile.jabatan}
                  </p>
                </div>

                {/* Quick Contact Buttons */}
                <div className="flex justify-center md:justify-start lg:justify-end gap-2.5 sm:gap-3 flex-wrap mt-2 lg:mt-0">
                  <a 
                    href={`tel:${profile.telepon.replace(/[^0-9+]/g, '')}`} 
                    className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-accent hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-800 flex items-center justify-center" 
                    title="Telepon"
                  >
                    <Phone size={20} />
                  </a>
                  <a 
                    href={`https://wa.me/${(profile.whatsapp || profile.telepon).replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 rounded-xl text-slate-600 dark:text-slate-400 hover:text-[#25D366] hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-800 flex items-center justify-center" 
                    title="WhatsApp"
                  >
                    <MessageCircle size={20} />
                  </a>
                  <a 
                    href={`mailto:${profile.email}`} 
                    className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-accent hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-800 flex items-center justify-center" 
                    title="Email"
                  >
                    <Mail size={20} />
                  </a>
                  {profile.instagram && (
                    <a 
                      href={profile.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-900 hover:bg-pink-50 rounded-xl text-slate-600 dark:text-slate-400 hover:text-[#E1306C] hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-800 flex items-center justify-center" 
                      title="Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                </div>

              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
