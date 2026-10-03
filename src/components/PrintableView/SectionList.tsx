import React from 'react';
import { SectionProps } from './sections/types';
import { SummarySection } from './sections/SummarySection';
import { MetricsSection } from './sections/MetricsSection';
import { ExperiencesSection } from './sections/ExperiencesSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { CertificationsSection } from './sections/CertificationsSection';
import { ConsultingProjectsSection } from './sections/ConsultingProjectsSection';
import { DigitalSolutionsSection } from './sections/DigitalSolutionsSection';
import { OrganizationsSection } from './sections/OrganizationsSection';
import { AchievementsSection } from './sections/AchievementsSection';

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

