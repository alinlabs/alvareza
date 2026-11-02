import React from 'react';
import { SectionProps } from '../types';
import { SummarySection } from './section-summary';
import { MetricsSection } from './section-metrics';
import { ExperiencesSection } from './section-experience';
import { EducationSection } from './section-education';
import { SkillsSection } from './section-skills';
import { CertificationsSection } from './section-certifications';
import { ConsultingProjectsSection } from './section-consulting-projects';
import { DigitalSolutionsSection } from './section-digital-solutions';
import { OrganizationsSection } from './section-organizations';
import { AchievementsSection } from './section-achievements';

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
