import { ApiService } from '../services/api';
import React, { useState, useEffect } from 'react';
import { ProfileData } from '../types';
import { Mail, Instagram, Phone } from 'lucide-react';

export default function Footer() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    ApiService.get<any>('profil').then(res => res.data)
      .then(data => setProfile(data))
      .catch(err => console.error("Failed to load profil data", err));
  }, []);

  if (!profile) return null;

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 pt-12 pb-24 md:py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-950 dark:text-slate-50 mb-2">
            {profile.nama}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; 2026 {profile.nama}. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <a
            href={`https://wa.me/${(profile.whatsapp || profile.telepon).replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-accent transition-colors"
            title="WhatsApp"
          >
            <Phone size={20} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="text-slate-400 hover:text-accent transition-colors"
            title="Email"
          >
            <Mail size={20} />
          </a>
          {profile.instagram && (
            <a
              href={profile.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-accent transition-colors"
              title="Instagram"
            >
              <Instagram size={20} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
