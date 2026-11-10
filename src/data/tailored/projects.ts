import { cvData, cvDataEn } from '../cv';
import { PRESET_PROJECTS_IN } from '../preset/ProjectsIn';
import { PRESET_PROJECTS_EN } from '../preset/ProjectsEn';
import { ConsultingProject, DigitalSolution } from '../../types';
import { resolvePresetBaseKey } from './experiences';

/**
 * Intelligently merges project highlights into strictly 3 comprehensive points (no more than 3 points).
 */
export function consolidateProjectHighlights(
  highlights: string[],
  lang: 'in' | 'en' | 'id' = 'in',
  fallbackHighlights?: string[]
): string[] {
  if (!highlights || highlights.length === 0) {
    if (fallbackHighlights && fallbackHighlights.length > 0) {
      return consolidateProjectHighlights(fallbackHighlights, lang);
    }
    return [];
  }

  const mergeTwo = (a: string, b: string): string => {
    const cleanA = a.trim().replace(/[.;]+$/, '');
    const cleanB = b.trim();
    if (!cleanB) return cleanA.endsWith('.') ? cleanA : cleanA + '.';

    const isEnglish = lang === 'en';
    const firstWord = cleanB.split(/\s+/)[0] || '';
    const isAcronym =
      /^[A-Z0-9]{2,}$/.test(firstWord) ||
      ['SOP', 'CRM', 'HR', 'GA', 'B2B', 'POS', 'ROAS', 'CSAT', 'SLA', 'IT', 'ERP', 'SKU', 'HPP', 'COGS', 'MC'].includes(firstWord);

    if (isEnglish) {
      const formattedB = isAcronym ? cleanB : cleanB.charAt(0).toLowerCase() + cleanB.slice(1);
      const connector = cleanA.length > 90 ? '; additionally, ' : ', while ';
      return `${cleanA}${connector}${formattedB}`;
    } else {
      const formattedB = isAcronym ? cleanB : cleanB.charAt(0).toLowerCase() + cleanB.slice(1);
      const connector = cleanA.length > 90 ? ', serta ' : ', sekaligus ';
      return `${cleanA}${connector}${formattedB}`;
    }
  };

  if (highlights.length === 3) {
    return highlights;
  }

  if (highlights.length === 4) {
    return [
      highlights[0],
      highlights[1],
      mergeTwo(highlights[2], highlights[3]),
    ];
  }

  if (highlights.length === 5) {
    return [
      mergeTwo(highlights[0], highlights[1]),
      mergeTwo(highlights[2], highlights[3]),
      highlights[4],
    ];
  }

  if (highlights.length >= 6) {
    return [
      mergeTwo(highlights[0], highlights[1]),
      mergeTwo(highlights[2], highlights[3]),
      mergeTwo(highlights[4], highlights[5]),
    ];
  }

  // If 2 highlights and fallback has a 3rd
  if (highlights.length === 2 && fallbackHighlights && fallbackHighlights.length >= 3) {
    return [highlights[0], highlights[1], fallbackHighlights[2]];
  }

  return highlights;
}

/**
 * Returns tailored consulting projects and summary based on the active role preset and language.
 * Falls back to base cvData / cvDataEn if preset is not explicitly mapped or has default data.
 */
export function getTailoredConsulting(
  presetKey?: string,
  lang: 'in' | 'en' | 'id' = 'in'
): { summary: string; projects: ConsultingProject[] } {
  const baseData = lang === 'en' ? cvDataEn.consulting : cvData.consulting;
  const rawKey = (presetKey || 'optimal').toLowerCase();
  const dataset = lang === 'en' ? PRESET_PROJECTS_EN : PRESET_PROJECTS_IN;

  // Resolve base key matching dataset
  const resolvedKey = resolvePresetBaseKey(rawKey);
  const tailoredSet = dataset[resolvedKey] || dataset[rawKey] || dataset['optimal'];

  if (tailoredSet) {
    const orderedProjects: ConsultingProject[] = [];
    const seenIds = new Set<string>();

    tailoredSet.projects.forEach((tailoredProj) => {
      const baseProj = baseData.projects.find((p) => p.id === tailoredProj.id);
      const rawHighlights = tailoredProj.highlights?.length ? tailoredProj.highlights : (baseProj?.highlights || []);
      const consolidatedHighlights = consolidateProjectHighlights(rawHighlights, lang, baseProj?.highlights);

      orderedProjects.push({
        ...(baseProj || tailoredProj),
        ...tailoredProj,
        role: tailoredProj.role || baseProj?.role || '',
        organization: tailoredProj.organization || baseProj?.organization || '',
        sector: tailoredProj.sector || baseProj?.sector || '',
        periodType: tailoredProj.periodType || baseProj?.periodType || '',
        highlights: consolidatedHighlights,
      });
      seenIds.add(tailoredProj.id);
    });

    baseData.projects.forEach((baseProj) => {
      if (!seenIds.has(baseProj.id)) {
        orderedProjects.push({
          ...baseProj,
          highlights: consolidateProjectHighlights(baseProj.highlights || [], lang),
        });
      }
    });

    return {
      summary: tailoredSet.summary || baseData.summary,
      projects: orderedProjects,
    };
  }

  return {
    ...baseData,
    projects: baseData.projects.map((p) => ({
      ...p,
      highlights: consolidateProjectHighlights(p.highlights || [], lang),
    })),
  };
}

/**
 * Returns tailored digital solutions based on the active role preset and language.
 */
export function getTailoredDigitalSolutions(
  presetKey?: string,
  lang: 'in' | 'en' | 'id' = 'in'
): DigitalSolution[] {
  const baseData = lang === 'en' ? cvDataEn.digitalSolutions : cvData.digitalSolutions;
  const rawKey = (presetKey || 'optimal').toLowerCase();
  const dataset = lang === 'en' ? PRESET_PROJECTS_EN : PRESET_PROJECTS_IN;

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
