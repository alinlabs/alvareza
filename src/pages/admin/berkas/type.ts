import { ReactNode } from 'react';

export interface QueueItem {
  id: string;
  name: string;
  url: string;
  file?: File;
  type: 'server' | 'local';
  thumbnail?: string;
}

export interface BerkasProps {
  setHeaderActions?: (actions: ReactNode) => void;
}

export interface BerkasFile {
  name: string;
  url: string;
  category: string;
}
