import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import EmailSender from './email-sender/main';
import ProfilEditor from './data/ProfilEditor';
import KeahlianEditor from './data/KeahlianEditor';
import KejuaraanEditor from './data/KejuaraanEditor';
import PelatihanEditor from './data/PelatihanEditor';
import PencapaianEditor from './data/PencapaianEditor';
import PendidikanEditor from './data/PendidikanEditor';
import KerjasamaEditor from './data/KerjasamaEditor';
import OrganisasiEditor from './data/OrganisasiEditor';
import ProfesiEditor from './data/ProfesiEditor';
import PortofolioEditor from './data/PortofolioEditor';
import RekruterEditor from './data/RekruterEditor';
import Login from './Login';
import Berkas from './berkas/main';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [headerActions, setHeaderActions] = useState<React.ReactNode | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Clear headerActions on activeTab change
  useEffect(() => {
    setHeaderActions(null);
  }, [activeTab]);

  // Check auth state on mount
  useEffect(() => {
    // Force light mode
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');

    // Check auth status from localStorage
    const auth = localStorage.getItem('admin_session_auth');
    if (auth === 'true') {
      setIsAuthorized(true);
    }
    setAuthLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_session_auth');
    localStorage.removeItem('admin_session_time');
    
    // Clear cookies by setting their expiry in the past
    try {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
      }
    } catch (e) {
      console.warn('Failed to clear cookies:', e);
    }

    window.location.href = '/';
  };

  // Render appropriate page inside AdminLayout
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'berkas': return <Berkas setHeaderActions={setHeaderActions} />;
      case 'rekruter': return <RekruterEditor />;
      case 'email-sender':
        return <EmailSender />;
      case 'data-profil': return <ProfilEditor />;
      case 'data-keahlian': return <KeahlianEditor />;
      case 'data-kejuaraan': return <KejuaraanEditor />;
      case 'data-pelatihan': return <PelatihanEditor />;
      case 'data-pencapaian': return <PencapaianEditor />;
      case 'data-pendidikan': return <PendidikanEditor />;
      case 'data-pengalaman-kerjasama': return <KerjasamaEditor />;
      case 'data-pengalaman-organisasi': return <OrganisasiEditor />;
      case 'data-pengalaman-profesi': return <ProfesiEditor />;
      case 'data-portofolio': return <PortofolioEditor />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return <Login onLoginSuccess={() => setIsAuthorized(true)} />;
  }

  return (
    <AdminLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      headerActions={headerActions}
    >
      {renderTabContent()}
    </AdminLayout>
  );
}
