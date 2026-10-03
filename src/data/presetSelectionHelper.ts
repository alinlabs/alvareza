export interface ItemSelectionState {
  summary: boolean;
  metrics: Record<number, boolean>;
  experiences: Record<string, boolean>;
  education: Record<number, boolean>;
  skills: {
    hardGroup: boolean;
    hard: Record<number, boolean>;
    softGroup: boolean;
    soft: Record<number, boolean>;
    toolsGroup: boolean;
    tools: Record<number, boolean>;
  };
  certifications: Record<string, boolean>;
  consultingProjects: Record<string, boolean>;
  digitalSolutions: Record<string, boolean>;
  organizations: Record<number, boolean>;
  achievements: Record<string, boolean>;
}

export interface SectionOrdersState {
  metrics: number[];
  experiences: string[];
  education: number[];
  skills: string[];
  skills_hard: number[];
  skills_soft: number[];
  skills_tools: number[];
  certifications: string[];
  consultingProjects: string[];
  digitalSolutions: string[];
  organizations: number[];
  achievements: string[];
}

export const defaultItemSelection: ItemSelectionState = {
  summary: true,
  metrics: {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
    12: true,
  },
  experiences: { 'exp-1': true, 'exp-2': true, 'exp-4': true, 'exp-3': true },
  education: { 0: true, 1: true },
  skills: {
    hardGroup: true,
    hard: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true },
    softGroup: true,
    soft: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true },
    toolsGroup: true,
    tools: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true },
  },
  certifications: {
    'cert-1': true,
    'cert-2': true,
    'cert-3': true,
    'cert-4': true,
    'cert-5': true,
    'cert-6': true,
    'cert-7': true,
    'cert-8': true,
  },
  consultingProjects: {
    'proj-1': true,
    'proj-2': true,
    'proj-3': true,
    'proj-4': true,
    'proj-5': true,
    'proj-6': true,
    'proj-7': true,
    'proj-8': true,
    'proj-9': true,
    'proj-10': true,
    'proj-11': true,
    'proj-12': true,
    'proj-13': true,
  },
  digitalSolutions: {
    'sol-1': true,
    'sol-2': true,
    'sol-3': true,
    'sol-4': true,
    'sol-5': true,
    'sol-6': true,
    'sol-8': true,
  },
  organizations: { 0: true, 1: true, 2: true, 3: true, 4: true },
  achievements: {
    'ach-1': true,
    'ach-2': true,
    'ach-3': true,
    'ach-4': true,
    'ach-5': true,
    'ach-6': true,
    'ach-7': true,
    'ach-8': true,
    'ach-9': true,
    'ach-10': true,
    'ach-11': true,
    'ach-12': true,
    'ach-13': true,
    'ach-14': true,
    'ach-15': true,
    'ach-16': true,
    'ach-17': true,
    'ach-18': true,
  },
};

export const defaultSectionOrders: SectionOrdersState = {
  metrics: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  experiences: ['exp-1', 'exp-2', 'exp-4', 'exp-3'],
  education: [0, 1],
  skills: ['hard', 'soft', 'tools'],
  skills_hard: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  skills_soft: [0, 1, 2, 3, 4, 5, 6, 7],
  skills_tools: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  certifications: ['cert-5', 'cert-3', 'cert-2', 'cert-4', 'cert-1', 'cert-6', 'cert-7', 'cert-8'],
  consultingProjects: ['proj-1', 'proj-2', 'proj-3', 'proj-4', 'proj-5', 'proj-6', 'proj-7', 'proj-8', 'proj-9', 'proj-10', 'proj-12', 'proj-13'],
  digitalSolutions: ['sol-1', 'sol-2', 'sol-4', 'sol-6', 'sol-5', 'sol-3', 'sol-8'],
  organizations: [0, 1, 2, 3, 4],
  achievements: ['ach-1', 'ach-2', 'ach-3', 'ach-4', 'ach-5', 'ach-6', 'ach-7', 'ach-8', 'ach-9', 'ach-10', 'ach-11', 'ach-12', 'ach-13', 'ach-14', 'ach-15', 'ach-16', 'ach-17', 'ach-18'],
};

/**
 * Helper to build an ItemSelectionState objectively and cleanly.
 */
export function createSelection(config: {
  summary?: boolean;
  metrics: number[];
  experiences?: string[];
  education?: number[];
  hardSkills: number[];
  softSkills: number[];
  tools: number[];
  certifications?: string[];
  consultingProjects: string[];
  digitalSolutions: string[];
  organizations?: number[];
  achievements?: string[];
}): ItemSelectionState {
  const metrics: Record<number, boolean> = {};
  for (let i = 0; i <= 12; i++) {
    metrics[i] = config.metrics.includes(i);
  }

  const expMap: Record<string, boolean> = {
    'exp-1': true,
    'exp-2': true,
    'exp-4': true,
    'exp-3': true,
  };
  if (config.experiences) {
    ['exp-1', 'exp-2', 'exp-4', 'exp-3'].forEach((k) => {
      expMap[k] = config.experiences!.includes(k);
    });
  }

  const eduMap: Record<number, boolean> = { 0: true, 1: false };
  if (config.education) {
    [0, 1].forEach((k) => {
      eduMap[k] = config.education!.includes(k);
    });
  }

  const hard: Record<number, boolean> = {};
  for (let i = 0; i <= 10; i++) {
    hard[i] = config.hardSkills.includes(i);
  }

  const soft: Record<number, boolean> = {};
  for (let i = 0; i <= 7; i++) {
    soft[i] = config.softSkills.includes(i);
  }

  const tools: Record<number, boolean> = {};
  for (let i = 0; i <= 8; i++) {
    tools[i] = config.tools.includes(i);
  }

  const allCertKeys = ['cert-1', 'cert-2', 'cert-3', 'cert-4', 'cert-5', 'cert-6', 'cert-7', 'cert-8'];
  const certMap: Record<string, boolean> = {};
  allCertKeys.forEach((k) => {
    certMap[k] = (config.certifications || []).includes(k);
  });

  const allProjKeys = [
    'proj-1', 'proj-2', 'proj-3', 'proj-4', 'proj-5',
    'proj-6', 'proj-7', 'proj-8', 'proj-9', 'proj-10',
    'proj-11', 'proj-12', 'proj-13'
  ];
  const consultingProjects: Record<string, boolean> = {};
  allProjKeys.forEach((k) => {
    consultingProjects[k] = config.consultingProjects.includes(k);
  });

  const allSolKeys = ['sol-1', 'sol-2', 'sol-3', 'sol-4', 'sol-5', 'sol-6', 'sol-8'];
  const digitalSolutions: Record<string, boolean> = {};
  allSolKeys.forEach((k) => {
    digitalSolutions[k] = config.digitalSolutions.includes(k);
  });

  const orgMap: Record<number, boolean> = {};
  const activeOrgs = config.organizations || [0, 2];
  for (let i = 0; i <= 4; i++) {
    orgMap[i] = activeOrgs.includes(i);
  }

  const allAchKeys = [
    'ach-1', 'ach-2', 'ach-3', 'ach-4', 'ach-5', 'ach-6',
    'ach-7', 'ach-8', 'ach-9', 'ach-10', 'ach-11', 'ach-12',
    'ach-13', 'ach-14', 'ach-15', 'ach-16', 'ach-17', 'ach-18'
  ];
  const achMap: Record<string, boolean> = {};
  const activeAchs = config.achievements || ['ach-1', 'ach-10', 'ach-7'];
  allAchKeys.forEach((k) => {
    achMap[k] = activeAchs.includes(k);
  });

  return {
    summary: config.summary !== false,
    metrics,
    experiences: expMap,
    education: eduMap,
    skills: {
      hardGroup: Object.values(hard).some(Boolean),
      hard,
      softGroup: Object.values(soft).some(Boolean),
      soft,
      toolsGroup: Object.values(tools).some(Boolean),
      tools,
    },
    certifications: certMap,
    consultingProjects,
    digitalSolutions,
    organizations: orgMap,
    achievements: achMap,
  };
}
