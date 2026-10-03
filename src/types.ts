export interface CVExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  category: 'operations' | 'b2b' | 'marketing';
  description: string;
  highlights: string[];
  metrics?: { label: string; value: string }[];
  tools: string[];
}

export interface CVConsultingProject {
  id: string;
  role: string;
  organization: string;
  sector: string;
  periodType: string;
  category: 'digital_tech' | 'operations_retail' | 'marketing_media' | 'event_public' | 'admin_finance';
  highlights: string[];
}

export interface CVConsultingCategory {
  categoryName: string;
  projects: CVConsultingProject[];
}

export interface CVConsultingData {
  id: string;
  role: string;
  title: string;
  period: string;
  type: string;
  summary: string;
  projects: CVConsultingProject[];
  projectCategories?: CVConsultingCategory[];
  tools: string[];
  metrics?: { label: string; value: string }[];
}

export interface CVProject {
  id: string;
  title: string;
  subtitle: string;
  category: 'enterprise' | 'ai' | 'management' | 'crm';
  description: string;
  impact: string;
  demoUrl?: string;
  isPrototype?: boolean;
  techStack: string[];
  features: string[];
}

export interface CVAchievement {
  id: string;
  title: string;
  organization: string;
  year: string;
  level: 'Nasional' | 'Provinsi' | 'Kabupaten/Kota' | 'Kampus';
  description?: string;
}

export interface CVCertification {
  id: string;
  title: string;
  issuer: string;
  grade?: string;
  credentialSub?: string;
  period: string;
  level?: string;
  description: string;
  skills: string[];
}

export interface CVOrganization {
  role: string;
  organization: string;
  period: string;
  description?: string;
}

export type Organization = CVOrganization;
export type DigitalSolution = CVProject;
export type ConsultingProject = CVConsultingProject;

export interface CVData {
  personalInfo: {
    fullName: string;
    headline: string;
    titles: string[];
    email: string;
    phone: string;
    website: string;
    linkedin: string;
    instagram: string;
    summary: string;
  };
  metrics: {
    label: string;
    value: string;
    sublabel: string;
  }[];
  skills: {
    soft: string[];
    hard: {
      category: string;
      items: string[];
    }[];
    tools: {
      name: string;
      category: string;
    }[];
    toolCategories?: {
      category: string;
      tools: string;
    }[];
  };
  certifications: CVCertification[];
  experiences: CVExperience[];
  consulting: CVConsultingData;
  digitalSolutions: CVProject[];
  achievements: CVAchievement[];
  organizations: CVOrganization[];
  education: {
    degree: string;
    institution: string;
    period: string;
    detail: string;
  }[];
}

export interface TailoredProjectSet {
  summary: string;
  projects: ConsultingProject[];
  digitalSolutions: DigitalSolution[];
}


