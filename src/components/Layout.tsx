import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-accent/20 selection:text-accent flex flex-col w-full overflow-x-hidden pb-16 md:pb-0">
      <Helmet>
        <title>Alvareza Hilka Pratama - Profesional & Business Owner</title>
        <meta name="description" content="Portfolio dan profil profesional Alvareza Hilka Pratama (Alvarezi, Alfareza, Alfa Reza, Reja). Kandidat profesional berpengalaman dalam pengembangan bisnis, operasional, kepemimpinan teknis, dan manajemen. Siap untuk peluang kerja dan lowongan di Jakarta, Bekasi, Karawang, dan sekitarnya." />
        <meta name="keywords" content="Alvareza, Alvareza Hilka Pratama, Varezza, Alvarezi, Alfareza, Alfa Reza, Reja, Profesional, Business Owner, Chief Operational Officer, COO, Kandidat, Cari Kerja, Lowongan Kerja, Job Seeker, Jakarta, Bekasi, Karawang, Jawa Barat, Portofolio Alvareza, CV Alvareza" />
      </Helmet>
      <Header />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
