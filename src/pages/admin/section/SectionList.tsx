import React from 'react';
import { SectionProps } from '../types';
import { SummarySection } from './summary';
import { MetricsSection } from './metrics';
import { ExperiencesSection } from './experience';
import { EducationSection } from './education';
import { SkillsSection } from './skills';
import { CertificationsSection } from './certifications';
import { ConsultingProjectsSection } from './consulting-projects';
import { DigitalSolutionsSection } from './digital-solutions';
import { OrganizationsSection } from './organizations';
import { AchievementsSection } from './achievements';

export const SectionList: React.FC<SectionProps & {
  customSummary?: string;
  setCustomSummary?: (val: string) => void;
  isSummaryExpanded?: boolean;
  setIsSummaryExpanded?: (val: boolean) => void;
  summaryTextareaRef?: React.RefObject<HTMLTextAreaElement>;
}> = (props) => {
  return (
    <div className="space-y-5 print:hidden">
      <div className="flex flex-col gap-y-5">
        <SummarySection {...props} />
        <MetricsSection {...props} />
        <ExperiencesSection {...props} />
        <EducationSection {...props} />
        <SkillsSection {...props} />
        <CertificationsSection {...props} />
        <ConsultingProjectsSection {...props} />
        <DigitalSolutionsSection {...props} />
        <OrganizationsSection {...props} />
        <AchievementsSection {...props} />
      </div>
    </div>
  );
};
