import React from 'react';
import {
  Briefcase,
  Layers,
  Sparkles,
  Cpu,
  Workflow,
  Boxes,
  Code2,
  BarChart3,
  FileText,
  Table2,
  Cloud,
  FileSpreadsheet,
  BookOpen,
  PenTool,
  Kanban,
  Palette,
} from 'lucide-react';

export interface MahaKaryaItem {
  id: string;
  slotNumber: number;
  title: string;
  subtitle?: string;
  logoUrl?: string; // Slot siap diisi logo oleh pengguna (SVG/PNG/WebP)
  webUrl?: string; // URL web tujuan saat kartu diklik (buka tab baru)
  icon: React.ComponentType<{ className?: string }>;
}

export interface ToolItem {
  id: string;
  slotNumber: number;
  title: string;
  subtitle?: string;
  logoUrl?: string; // Slot siap diisi logo oleh pengguna (seperti Google Docs, Sheets, dll)
  icon: React.ComponentType<{ className?: string }>;
}

// 8 Portofolio Unggulan (4 ke samping x 2 ke bawah = 8 kartu 1:1)
// Baris 1: HRMATRIX | TALENTY | KARIR KITA | MITRA
// Baris 2: VYNANCE | NEXTMARK | LOGISTOR | MYDIBY
export const DEFAULT_MAHA_KARYA_SLOTS: MahaKaryaItem[] = [
  {
    id: 'mk-1',
    slotNumber: 1,
    title: 'HRMATRIX',
    subtitle: 'Integrated HRIS & GA Platform',
    logoUrl: '/gambar/logo-web/hrmatrix.svg',
    webUrl: 'https://hrmatrix.my.id',
    icon: Briefcase,
  },
  {
    id: 'mk-2',
    slotNumber: 2,
    title: 'TALENTY',
    subtitle: 'People Development & Assessment',
    logoUrl: '/gambar/logo-web/talenty.svg',
    webUrl: 'https://mytalenty.vercel.app',
    icon: Sparkles,
  },
  {
    id: 'mk-3',
    slotNumber: 3,
    title: 'KARIR KITA',
    subtitle: 'Career Hub & Job Portal',
    logoUrl: '/gambar/logo-web/karirkita.svg',
    webUrl: 'https://karirkita.my.id',
    icon: Workflow,
  },
  {
    id: 'mk-4',
    slotNumber: 4,
    title: 'MITRA',
    subtitle: 'Enterprise Resource Planning',
    logoUrl: '/gambar/logo-web/mitragateway.svg',
    webUrl: 'https://mitragateway.vercel.app',
    icon: Layers,
  },
  {
    id: 'mk-5',
    slotNumber: 5,
    title: 'VYNANCE',
    subtitle: 'Accounting & Finance Ledger',
    logoUrl: '/gambar/logo-web/vynance.svg',
    webUrl: 'https://vynance.vercel.app',
    icon: BarChart3,
  },
  {
    id: 'mk-6',
    slotNumber: 6,
    title: 'NEXTMARK',
    subtitle: 'CRM & Marketing Automation',
    logoUrl: '/gambar/logo-web/nextmarketing.svg',
    webUrl: 'https://nextmark.vercel.app',
    icon: Code2,
  },
  {
    id: 'mk-7',
    slotNumber: 7,
    title: 'LOGISTOR',
    subtitle: 'Supply Chain & Logistics',
    logoUrl: '/gambar/logo-web/logistor.svg',
    webUrl: 'https://logistor.vercel.app',
    icon: Boxes,
  },
  {
    id: 'mk-8',
    slotNumber: 8,
    title: 'MYDIBY',
    subtitle: 'B2B Corporate Intelligence',
    logoUrl: '/gambar/logo-web/mydiby.svg',
    webUrl: 'https://mydiby.vercel.app',
    icon: Cpu,
  },
];

// 8 Tools & Alat Ekosistem Kerja (4 ke samping x 2 ke bawah = 8 kartu 1:1)
// Baris 1: GOOGLE (Google Analytics) | MICROSOFT (Microsoft 365) | CLOUD (Cloud Platform) | META (Meta Business)
// Baris 2: CORETAX | BPJSTK | EDABU | KEMNAKER
export const DEFAULT_TOOL_SLOTS: ToolItem[] = [
  {
    id: 'tool-1',
    slotNumber: 1,
    title: 'GOOGLE',
    subtitle: 'Google Analytics 4 & Data Platform',
    logoUrl: '/gambar/logo-tools/google-analytics.svg',
    icon: FileText,
  },
  {
    id: 'tool-2',
    slotNumber: 2,
    title: 'MICROSOFT',
    subtitle: 'Microsoft 365 Enterprise Ecosystem',
    logoUrl: '/gambar/logo-tools/microsoft-365.svg',
    icon: Table2,
  },
  {
    id: 'tool-3',
    slotNumber: 3,
    title: 'CLOUD',
    subtitle: 'Google Cloud Platform & Infrastructure',
    logoUrl: '/gambar/logo-tools/cloud.svg',
    icon: Cloud,
  },
  {
    id: 'tool-4',
    slotNumber: 4,
    title: 'META',
    subtitle: 'Meta Ads Manager & Business Suite',
    logoUrl: '/gambar/logo-tools/meta.svg',
    icon: FileSpreadsheet,
  },
  {
    id: 'tool-5',
    slotNumber: 5,
    title: 'CORETAX',
    subtitle: 'DJP Coretax System & Perpajakan',
    logoUrl: '/gambar/logo-tools/djp.svg',
    icon: BookOpen,
  },
  {
    id: 'tool-6',
    slotNumber: 6,
    title: 'BPJSTK',
    subtitle: 'BPJS Ketenagakerjaan (SIPP Online & JHT)',
    logoUrl: '/gambar/logo-tools/bpjs-tk.svg',
    icon: PenTool,
  },
  {
    id: 'tool-7',
    slotNumber: 7,
    title: 'EDABU',
    subtitle: 'BPJS Kesehatan (e-Dabu Badan Usaha)',
    logoUrl: '/gambar/logo-tools/kemenkes.svg',
    icon: Kanban,
  },
  {
    id: 'tool-8',
    slotNumber: 8,
    title: 'KEMNAKER',
    subtitle: 'Kementerian Ketenagakerjaan RI (WLPKP & SiapKerja)',
    logoUrl: '/gambar/logo-tools/kemnaker.svg',
    icon: Palette,
  },
];

interface ExecutiveMahaKaryaProps {
  language?: 'in' | 'en' | 'id';
  onNavigateToPortfolio?: () => void;
  mahaKaryaItems?: MahaKaryaItem[];
  toolItems?: ToolItem[];
}

export const ExecutiveMahaKarya: React.FC<ExecutiveMahaKaryaProps> = ({
  language = 'in',
  onNavigateToPortfolio,
  mahaKaryaItems = DEFAULT_MAHA_KARYA_SLOTS,
  toolItems = DEFAULT_TOOL_SLOTS,
}) => {
  return (
    <div className="pt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
      {/* Kolom Kiri: Maha Karya (8 Card, 4 ke samping x 2 ke bawah) */}
      <div className="flex flex-col space-y-1.5 sm:space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
            Maha Karya
          </h2>
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">
            {language === 'en' ? 'Portfolio' : 'Portofolio'}
          </span>
        </div>

        {/* 8 Card 1:1 Aspect Ratio (4 x 2) */}
        <div className="grid grid-cols-4 grid-rows-2 gap-1.5 sm:gap-2 w-full">
          {mahaKaryaItems.slice(0, 8).map((item) => {
            const IconComponent = item.icon;

            const targetUrl = item.webUrl;

            return (
              <a
                key={item.id}
                href={targetUrl || '#'}
                target={targetUrl ? '_blank' : undefined}
                rel={targetUrl ? 'noopener noreferrer' : undefined}
                onClick={targetUrl ? undefined : onNavigateToPortfolio}
                title={`${item.title}${item.subtitle ? ` (${item.subtitle})` : ''}${targetUrl ? ` — Buka ${targetUrl}` : ''}`}
                className="aspect-square rounded-lg sm:rounded-xl bg-white border border-slate-200/70 hover:border-blue-400/80 transition-all duration-200 shadow-2xs hover:shadow-xs flex flex-col items-center justify-center p-1 sm:p-1.5 group cursor-pointer relative overflow-hidden select-none"
              >
                <div className="w-full h-full flex flex-col items-center justify-center">
                  {/* Logo / Icon directly without outer card wrapper */}
                  <div className="w-7 h-7 sm:w-8.5 sm:h-8.5 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={item.title}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                    )}
                  </div>
                  {/* Text Label */}
                  <span className="mt-1 sm:mt-1.5 text-[7.5px] sm:text-[9px] font-bold text-slate-800 tracking-tight group-hover:text-blue-600 truncate max-w-full text-center px-0.5 leading-tight transition-colors">
                    {item.title}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Kolom Kanan: Tools & Alat (8 Card, 4 ke samping x 2 ke bawah) */}
      <div className="flex flex-col space-y-1.5 sm:space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
            Tools &amp; Alat
          </h2>
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">
            {language === 'en' ? 'Ecosystem' : 'Ekosistem'}
          </span>
        </div>

        {/* 8 Card 1:1 Aspect Ratio (4 x 2) */}
        <div className="grid grid-cols-4 grid-rows-2 gap-1.5 sm:gap-2 w-full">
          {toolItems.slice(0, 8).map((tool) => {
            const IconComponent = tool.icon;

            return (
              <div
                key={tool.id}
                title={`${tool.title}${tool.subtitle ? ` (${tool.subtitle})` : ''}`}
                className="aspect-square rounded-lg sm:rounded-xl bg-white border border-slate-200/70 hover:border-emerald-400/80 transition-all duration-200 shadow-2xs hover:shadow-xs flex flex-col items-center justify-center p-1 sm:p-1.5 group cursor-pointer relative overflow-hidden select-none"
              >
                <div className="w-full h-full flex flex-col items-center justify-center">
                  {/* Logo / Icon directly without outer card wrapper */}
                  <div className="w-7 h-7 sm:w-8.5 sm:h-8.5 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                    {tool.logoUrl ? (
                      <img
                        src={tool.logoUrl}
                        alt={tool.title}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                    )}
                  </div>
                  {/* Text Label */}
                  <span className="mt-1 sm:mt-1.5 text-[7.5px] sm:text-[9px] font-bold text-slate-800 tracking-tight group-hover:text-emerald-600 truncate max-w-full text-center px-0.5 leading-tight transition-colors">
                    {tool.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
