import React from 'react';
import { CvDesignType } from '../types';

export interface MindmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetKey?: string;
}

export type DirectLinkModalProps = MindmapModalProps;
export type LamarKerjaMindmapModalProps = MindmapModalProps;

export type CardId = 'cv' | 'portofolio' | 'sertifikasi' | 'akademik' | 'identitas' | 'foto';

export interface CardStateCV {
  preset: string;
  lang: 'id' | 'en';
  align: 'left' | 'justify';
  color: string;
  design?: CvDesignType;
}

export interface CardStateGeneric {
  specific: string;
  isColor: boolean;
  isCompressed?: boolean;
}

export interface SeekbarProps {
  label: string;
  leftLabel: string;
  leftIcon?: React.ReactNode;
  rightLabel: string;
  rightIcon?: React.ReactNode;
  value: boolean; // false = left, true = right
  onChange: (val: boolean) => void;
  activeTag?: string;
}

export interface UrlBoxProps {
  label?: string;
  url: string;
  longUrl?: string;
  metaBadge?: React.ReactNode;
  isCopied: boolean;
  onCopy: (urlToCopy?: string) => void;
}
