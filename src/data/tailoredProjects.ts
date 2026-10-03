import { cvData } from './cvData';
import { cvDataEn } from './cvDataEn';
import { PRESET_PROJECTS_ID } from './presetProjectsId';
import { PRESET_PROJECTS_EN } from './presetProjectsEn';
import { ConsultingProject, DigitalSolution } from '../types';
import { resolvePresetBaseKey } from './tailoredExperiences';

/**
 * Returns tailored consulting projects and summary based on the active role preset and language.
 * Falls back to base cvData / cvDataEn if preset is not explicitly mapped or has default data.
 */
export function getTailoredConsulting(
  presetKey?: string,
  lang: 'id' | 'en' = 'id'
): { summary: string; projects: ConsultingProject[] } {
  const baseData = lang === 'en' ? cvDataEn.consulting : cvData.consulting;
  const rawKey = (presetKey || 'optimal').toLowerCase();
  const dataset = lang === 'en' ? PRESET_PROJECTS_EN : PRESET_PROJECTS_ID;

  // Resolve base key matching dataset
  const resolvedKey = resolvePresetBaseKey(rawKey);
  const tailoredSet = dataset[resolvedKey] || dataset[rawKey] || dataset['optimal'];

  if (tailoredSet) {
    const orderedProjects: ConsultingProject[] = [];
    const seenIds = new Set<string>();

    tailoredSet.projects.forEach((tailoredProj) => {
      const baseProj = baseData.projects.find((p) => p.id === tailoredProj.id);
      orderedProjects.push({
        ...(baseProj || tailoredProj),
        ...tailoredProj,
        role: tailoredProj.role || baseProj?.role || '',
        organization: tailoredProj.organization || baseProj?.organization || '',
        sector: tailoredProj.sector || baseProj?.sector || '',
        periodType: tailoredProj.periodType || baseProj?.periodType || '',
        highlights: tailoredProj.highlights?.length ? tailoredProj.highlights : (baseProj?.highlights || []),
      });
      seenIds.add(tailoredProj.id);
    });

    baseData.projects.forEach((baseProj) => {
      if (!seenIds.has(baseProj.id)) {
        orderedProjects.push(baseProj);
      }
    });

    return {
      summary: tailoredSet.summary || baseData.summary,
      projects: orderedProjects,
    };
  }

  return baseData;
}

/**
 * Returns tailored digital solutions based on the active role preset and language.
 */
export function getTailoredDigitalSolutions(
  presetKey?: string,
  lang: 'id' | 'en' = 'id'
): DigitalSolution[] {
  const baseData = lang === 'en' ? cvDataEn.digitalSolutions : cvData.digitalSolutions;
  const rawKey = (presetKey || 'optimal').toLowerCase();
  const dataset = lang === 'en' ? PRESET_PROJECTS_EN : PRESET_PROJECTS_ID;

  const resolvedKey = resolvePresetBaseKey(rawKey);
  const targetSet = dataset[resolvedKey] || dataset[rawKey] || dataset['optimal'];

  if (targetSet?.digitalSolutions?.length) {
    return baseData.map((baseSol) => {
      const tailoredSol = targetSet.digitalSolutions.find((s) => s.id === baseSol.id);
      if (tailoredSol) {
        return {
          ...baseSol,
          title: tailoredSol.title || baseSol.title,
          subtitle: tailoredSol.subtitle || baseSol.subtitle,
          description: tailoredSol.description || baseSol.description,
          impact: tailoredSol.impact || baseSol.impact,
          techStack: tailoredSol.techStack || baseSol.techStack,
          features: tailoredSol.features || baseSol.features,
        };
      }
      return baseSol;
    });
  }

  return baseData;
}
