import { CVData } from '../../types';
import { personalInfoIn, personalInfoId, personalInfoEn } from './personal';
import { metricsIn, metricsId, metricsEn } from './metrics';
import { certificationsIn, certificationsId, certificationsEn } from './certifications';
import { skillsIn, skillsId, skillsEn } from './skills';
import { experiencesIn, experiencesId, experiencesEn } from './experiences';
import { consultingIn, consultingId, consultingEn, organizationsIn, organizationsId, organizationsEn } from './projects';
import { digitalSolutionsIn, digitalSolutionsId, digitalSolutionsEn } from './portofolios';
import { educationIn, educationId, educationEn, achievementsIn, achievementsId, achievementsEn } from './educations';

export * from './personal';
export * from './metrics';
export * from './certifications';
export * from './skills';
export * from './experiences';
export * from './projects';
export * from './portofolios';
export * from './educations';

export const cvDataIn: CVData = {
  personalInfo: personalInfoIn,
  metrics: metricsIn,
  skills: skillsIn,
  certifications: certificationsIn,
  experiences: experiencesIn,
  consulting: consultingIn,
  digitalSolutions: digitalSolutionsIn,
  achievements: achievementsIn,
  organizations: organizationsIn,
  education: educationIn,
};

export const cvData: CVData = cvDataIn;

export const cvDataEn: CVData = {
  personalInfo: personalInfoEn,
  metrics: metricsEn,
  skills: skillsEn,
  certifications: certificationsEn,
  experiences: experiencesEn,
  consulting: consultingEn,
  digitalSolutions: digitalSolutionsEn,
  achievements: achievementsEn,
  organizations: organizationsEn,
  education: educationEn,
};

export const getCvData = (language: 'in' | 'en' | 'id' = 'in'): CVData =>
  language === 'en' ? cvDataEn : cvDataIn;
