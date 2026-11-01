import { PDFRenderContext } from './context';

export function renderSkills(ctx: PDFRenderContext): void {
  const { doc, cv, lang, options, scale, margin, adapt } = ctx;
  const sec = options?.sections;
  const itm = options?.items;
  const skillConfig = itm?.skills;
  const sectionOrders = options?.sectionOrders;

  const showHardSkills = skillConfig
    ? (skillConfig.hardGroup !== false && Object.values(skillConfig.hard || {}).some(Boolean))
    : sec?.skills !== false;

  const showSoftSkills = skillConfig
    ? (skillConfig.softGroup !== false && Object.values(skillConfig.soft || {}).some(Boolean))
    : sec?.skills !== false;

  const showToolsSkills = skillConfig
    ? (skillConfig.toolsGroup !== false && Object.values(skillConfig.tools || {}).some(Boolean))
    : sec?.skills !== false;

  const hasAnySkills = showHardSkills || showSoftSkills || showToolsSkills;
  if (!hasAnySkills) return;

  ctx.addSectionHeader(lang === 'en' ? 'Core Competencies & Skills' : 'Keahlian');

  // Helper to render normal descriptive black bold capital category heading (no block/color)
  let isFirstGroup = true;
  const renderSkillGroupHeading = (title: string) => {
    ctx.checkPageBreak(12 * scale);
    if (!isFirstGroup) {
      ctx.addY(2.2 * scale);
    }
    isFirstGroup = false;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5 * scale);
    doc.setTextColor(0, 0, 0); // Pure black descriptive text: "warna ini hitam, hanya saja bold dan capital"
    doc.text(title.toUpperCase(), margin, ctx.getY());
    ctx.addY(3.8 * scale);
  };

  // 1. Hard Skills
  if (showHardSkills) {
    const rawHardList = (cv.skills.hard || []).map((group, idx) => ({ ...group, idx }));
    const filteredHardList = skillConfig?.hard && typeof skillConfig.hard === 'object'
      ? rawHardList.filter((g) => (skillConfig.hard as Record<number, boolean>)[g.idx])
      : rawHardList;

    const sortedHardList = [...filteredHardList].sort((a, b) => {
      const idxA = sectionOrders?.skills_hard?.indexOf(a.idx) ?? -1;
      const idxB = sectionOrders?.skills_hard?.indexOf(b.idx) ?? -1;
      return (idxA !== -1 ? idxA : a.idx) - (idxB !== -1 ? idxB : b.idx);
    });

    if (sortedHardList.length > 0) {
      renderSkillGroupHeading(lang === 'en' ? 'HARD SKILLS' : 'HARD SKILL');
      sortedHardList.forEach((group) => {
        const hardCategory = adapt(group.category);
        const hardItemsAdapted = group.items.map((item) => adapt(item)).join(', ');
        ctx.addBoldPrefixHangingBullet(hardCategory, hardItemsAdapted, {
          bulletChar: '•',
          bulletOffset: 0.8 * scale,
          textOffset: 4.8 * scale,
          fontSize: 8.3 * scale,
          lineHeight: 3.6 * scale,
          gapAfter: 1.0 * scale,
        });
      });
    }
  }

  // 2. Soft Skills
  if (showSoftSkills) {
    const rawSoftList = (cv.skills.soft || []).map((item, idx) => ({ item, idx }));
    const filteredSoftList = skillConfig?.soft && typeof skillConfig.soft === 'object'
      ? rawSoftList.filter((s) => (skillConfig.soft as Record<number, boolean>)[s.idx])
      : rawSoftList;

    const sortedSoftList = [...filteredSoftList].sort((a, b) => {
      const idxA = sectionOrders?.skills_soft?.indexOf(a.idx) ?? -1;
      const idxB = sectionOrders?.skills_soft?.indexOf(b.idx) ?? -1;
      return (idxA !== -1 ? idxA : a.idx) - (idxB !== -1 ? idxB : b.idx);
    });

    if (sortedSoftList.length > 0) {
      renderSkillGroupHeading(lang === 'en' ? 'SOFT SKILLS' : 'SOFT SKILL');
      sortedSoftList.forEach(({ item }) => {
        const colonIdx = item.indexOf(':');
        if (colonIdx !== -1) {
          const prefix = item.substring(0, colonIdx).trim();
          const rest = item.substring(colonIdx + 1).trim();
          ctx.addBoldPrefixHangingBullet(adapt(prefix), adapt(rest), {
            bulletChar: '•',
            bulletOffset: 0.8 * scale,
            textOffset: 4.8 * scale,
            fontSize: 8.3 * scale,
            lineHeight: 3.6 * scale,
            gapAfter: 1.0 * scale,
          });
        } else {
          ctx.addHangingBullet(adapt(item), {
            bulletChar: '•',
            bulletOffset: 0.8 * scale,
            textOffset: 4.8 * scale,
            lineHeight: 3.6 * scale,
            gapAfter: 1.0 * scale,
          });
        }
      });
    }
  }

  // 3. Tools & Technologies
  if (showToolsSkills) {
    if (cv.skills.toolCategories && cv.skills.toolCategories.length > 0) {
      const rawToolCats = cv.skills.toolCategories.map((cat, idx) => ({ ...cat, idx }));
      const filteredToolCats = skillConfig?.tools && typeof skillConfig.tools === 'object'
        ? rawToolCats.filter((c) => (skillConfig.tools as Record<number, boolean>)[c.idx])
        : rawToolCats;

      const sortedToolCats = [...filteredToolCats].sort((a, b) => {
        const idxA = sectionOrders?.skills_tools?.indexOf(a.idx) ?? -1;
        const idxB = sectionOrders?.skills_tools?.indexOf(b.idx) ?? -1;
        return (idxA !== -1 ? idxA : a.idx) - (idxB !== -1 ? idxB : b.idx);
      });

      if (sortedToolCats.length > 0) {
        renderSkillGroupHeading(lang === 'en' ? 'TOOLS & ECOSYSTEM' : 'TOOLS & EKOSISTEM');
        sortedToolCats.forEach((cat) => {
          ctx.addBoldPrefixHangingBullet(adapt(cat.category), cat.tools, {
            bulletChar: '•',
            bulletOffset: 0.8 * scale,
            textOffset: 4.8 * scale,
            fontSize: 8.3 * scale,
            lineHeight: 3.6 * scale,
            gapAfter: 1.0 * scale,
          });
        });
      }
    } else {
      const rawToolsList = cv.skills.tools || [];
      const toolNames = rawToolsList.map((t) => t.name).join(', ');
      if (toolNames) {
        renderSkillGroupHeading(lang === 'en' ? 'TOOLS & ECOSYSTEM' : 'TOOLS & EKOSISTEM');
        const toolsTitle = lang === 'en' ? 'Software & Applications' : 'Aplikasi & Software';
        ctx.addBoldPrefixHangingBullet(toolsTitle, toolNames, {
          bulletChar: '•',
          bulletOffset: 0.8 * scale,
          textOffset: 4.8 * scale,
          fontSize: 8.3 * scale,
          lineHeight: 3.6 * scale,
          gapAfter: 1.0 * scale,
        });
      }
    }
  }

  ctx.addY(1.0 * scale);
}
