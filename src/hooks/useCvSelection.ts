import { useState } from 'react';
import { CVData } from '../types';
import { 
  ItemSelectionState, 
  optimalItemSelection, 
  getPresetSectionOrders, 
  getItemSelectionForPreset 
} from '../data/presetItemSelections';
import { resolvePresetFromQuery } from '../data/rolePresetsConfig';

export const useCvSelection = (
  cvData: CVData,
  onPresetChange?: (preset: string) => void,
  initialPresetRole?: string
) => {
  const initialKey = initialPresetRole
    ? resolvePresetFromQuery(initialPresetRole) || initialPresetRole
    : 'optimal';

  const [items, setItems] = useState<ItemSelectionState>(() => getItemSelectionForPreset(initialKey));
  const [sectionOrders, setSectionOrders] = useState(() => getPresetSectionOrders(initialKey));

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    summary: false,
    metrics: false,
    experiences: false,
    education: false,
    skills: false,
    skills_hard: false,
    skills_soft: false,
    skills_tools: false,
    certifications: false,
    consultingProjects: false,
    digitalSolutions: false,
    organizations: false,
    achievements: false,
  });

  const [selectedPresetRole, setSelectedPresetRole] = useState<string>(initialKey);
  const [activePreset, setActivePreset] = useState<string | null>(initialKey);

  const moveItem = (sectionKey: keyof typeof sectionOrders, indexOrId: string | number, direction: 'up' | 'down') => {
    setActivePreset(null);
    setSectionOrders(prev => {
      const arr = [...prev[sectionKey]];
      const idx = arr.indexOf(indexOrId as never);
      if (idx === -1) return prev;
      
      if (direction === 'up' && idx > 0) {
        [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      } else if (direction === 'down' && idx < arr.length - 1) {
        [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      }
      return { ...prev, [sectionKey]: arr };
    });
  };

  const toggleAccordion = (secKey: string) => {
    setExpandedSections(prev => ({ ...prev, [secKey]: !prev[secKey] }));
  };

  const isSectionActive = (secKey: keyof ItemSelectionState) => {
    if (secKey === 'summary') return !!items.summary;
    if (secKey === 'skills') {
      return !!items.skills.hardGroup || !!items.skills.softGroup || !!items.skills.toolsGroup;
    }
    const group = items[secKey] as Record<string | number, boolean>;
    return group ? Object.values(group).some(Boolean) : false;
  };

  const setSectionActiveState = (secKey: keyof ItemSelectionState, active: boolean) => {
    setActivePreset(null);
    if (secKey === 'summary') {
      setItems((prev) => ({ ...prev, summary: active }));
    } else if (secKey === 'metrics') {
      setItems((prev) => {
        const updated: Record<number, boolean> = {};
        cvData.metrics.forEach((_, idx) => { updated[idx] = active; });
        return { ...prev, metrics: updated };
      });
    } else if (secKey === 'experiences') {
      setItems((prev) => {
        const updated: Record<string, boolean> = {};
        cvData.experiences.forEach((e) => { updated[e.id] = active; });
        return { ...prev, experiences: updated };
      });
    } else if (secKey === 'education') {
      setItems((prev) => {
        const updated: Record<number, boolean> = {};
        cvData.education.forEach((_, idx) => { updated[idx] = active; });
        return { ...prev, education: updated };
      });
    } else if (secKey === 'skills') {
      setItems((prev) => {
        const hardUpdated: Record<number, boolean> = {};
        cvData.skills.hard.forEach((_, idx) => { hardUpdated[idx] = active; });
        const softUpdated: Record<number, boolean> = {};
        cvData.skills.soft.forEach((_, idx) => { softUpdated[idx] = active; });
        const toolsUpdated: Record<number, boolean> = {};
        (cvData.skills.toolCategories || []).forEach((_, idx) => { toolsUpdated[idx] = active; });

        return {
          ...prev,
          skills: {
            hardGroup: active,
            hard: hardUpdated,
            softGroup: active,
            soft: softUpdated,
            toolsGroup: active,
            tools: toolsUpdated,
          },
        };
      });
    } else if (secKey === 'certifications') {
      setItems((prev) => {
        const updated: Record<string, boolean> = {};
        (cvData.certifications || []).forEach((c) => { updated[c.id] = active; });
        return { ...prev, certifications: updated };
      });
    } else if (secKey === 'consultingProjects') {
      setItems((prev) => {
        const updated: Record<string, boolean> = {};
        (cvData.consulting.projects || []).forEach((p) => { updated[p.id] = active; });
        return { ...prev, consultingProjects: updated };
      });
    } else if (secKey === 'digitalSolutions') {
      setItems((prev) => {
        const updated: Record<string, boolean> = {};
        (cvData.digitalSolutions || []).forEach((s) => { updated[s.id] = active; });
        return { ...prev, digitalSolutions: updated };
      });
    } else if (secKey === 'organizations') {
      setItems((prev) => {
        const updated: Record<number, boolean> = {};
        (cvData.organizations || []).forEach((_, idx) => { updated[idx] = active; });
        return { ...prev, organizations: updated };
      });
    } else if (secKey === 'achievements') {
      setItems((prev) => {
        const updated: Record<string, boolean> = {};
        const ordered = [...(cvData.achievements || [])].sort(
          (a, b) => sectionOrders.achievements.indexOf(a.id) - sectionOrders.achievements.indexOf(b.id)
        );
        ordered.forEach((a, idx) => {
          updated[a.id] = active && idx < 5;
        });
        return { ...prev, achievements: updated };
      });
    }
  };

  const toggleEntireSection = (secKey: keyof ItemSelectionState) => {
    const active = isSectionActive(secKey);
    setSectionActiveState(secKey, !active);
  };

  const toggleItem = (secKey: keyof ItemSelectionState, subKey: string | number) => {
    setActivePreset(null);
    setItems((prev) => {
      const group = (prev[secKey] || {}) as Record<string | number, boolean>;
      const willBeActive = !group[subKey];

      if (secKey === 'achievements' && willBeActive) {
        const currentActiveCount = Object.values(group).filter(Boolean).length;
        if (currentActiveCount >= 5) {
          return prev;
        }
      }

      return {
        ...prev,
        [secKey]: {
          ...group,
          [subKey]: willBeActive,
        },
      };
    });
  };

  const applyPreset = (preset: string) => {
    setSelectedPresetRole(preset);
    setActivePreset(preset);
    if (onPresetChange) onPresetChange(preset);
    setSectionOrders(getPresetSectionOrders(preset));
    setItems(getItemSelectionForPreset(preset));
  };

  const scrollToSection = (secKey: string) => {
    setExpandedSections((prev) => ({ ...prev, [secKey]: true }));
    setTimeout(() => {
      const el = document.getElementById(`section-${secKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return {
    items,
    setItems,
    sectionOrders,
    setSectionOrders,
    expandedSections,
    setExpandedSections,
    selectedPresetRole,
    setSelectedPresetRole,
    activePreset,
    setActivePreset,
    moveItem,
    toggleAccordion,
    isSectionActive,
    setSectionActiveState,
    toggleEntireSection,
    toggleItem,
    applyPreset,
    scrollToSection
  };
};
