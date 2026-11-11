import React from 'react';
import { CVData, DesignPreset } from '../../types';
import { ItemSelectionState } from '../../data/preset/config/item-seleksi';
import { PRESET_HEADLINES, PRESET_SUMMARIES } from '../../data/preset/config/ringkasan-headline';
import { resolvePresetFromQuery } from '../../data/preset/config/konfigurasi-peran';
import { getTailoredMetrics } from '../../data/preset/tailored/metrik';
import { getTailoredExperiences } from '../../data/preset/tailored/pengalaman';
import { getTailoredConsulting, getTailoredDigitalSolutions } from '../../data/preset/tailored/proyek';
import { getTailoredOrganizations } from '../../data/preset/tailored/organisasi';

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */

export interface AtsSectionProps {
  cvData: CVData;
  items: ItemSelectionState;
  language: 'in' | 'en' | 'id';
  sectionOrders: any;
  designPreset?: DesignPreset;
  renderSectionHeader: (title: string) => React.ReactNode;
  preset?: string | null;
  headline?: string;
  summaryText?: string;
  textAlign?: 'left' | 'justify';
}

export interface AtsDocumentSheetProps {
  sectionOrders: any;
  cvData: CVData;
  items: ItemSelectionState;
  language: 'in' | 'en' | 'id';
  totalActiveItems: number;
  headline?: string;
  summaryText?: string;
  designPreset?: DesignPreset;
  preset?: string | null;
  textAlign?: 'left' | 'justify';
  headerColor?: string;
}

/* ==========================================================================
   SUB-COMPONENTS ATS RENDER
   ========================================================================== */

export const AtsHeader: React.FC<AtsSectionProps> = ({ cvData, headline, preset, language, designPreset }) => {
  const canonicalPreset = (preset && resolvePresetFromQuery(preset)) || preset;
  const isHeadlineExplicit = headline !== undefined;
  const activeHeadline = isHeadlineExplicit
    ? headline
    : (canonicalPreset && PRESET_HEADLINES[canonicalPreset]?.[language]) ||
      (preset && PRESET_HEADLINES[preset]?.[language]) ||
      cvData.personalInfo.headline;

  if (designPreset === 'modern') {
    return (
      <header className="pb-3 mb-3 border-b border-slate-200 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        {/* Informasi Kandidat di Kiri */}
        <div className="flex-1 min-w-0 text-left pt-0.5">
          <h1 className="text-[14pt] tracking-tight uppercase leading-snug font-extrabold text-[#0F172A] break-words text-left">
            {cvData.personalInfo.fullName}
          </h1>

          {activeHeadline && activeHeadline.trim() ? (
            <p className="text-xs sm:text-[13px] tracking-tight font-bold text-[#0F172A] mt-1 break-words text-left">
              {activeHeadline}
            </p>
          ) : null}

          <div className="mt-2 text-xs text-slate-600 font-normal space-y-1 text-left">
            <div className="flex flex-wrap items-center justify-start gap-x-5 gap-y-1 text-left">
              <span>{cvData.personalInfo.phone}</span>
              <a href={`mailto:${cvData.personalInfo.email}`} className="text-slate-900 hover:underline">
                {cvData.personalInfo.email}
              </a>
              <a href={`https://${cvData.personalInfo.website}`} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline">
                {cvData.personalInfo.website}
              </a>
            </div>

            <div className="text-left">
              <a href={`https://${cvData.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline font-bold">
                {cvData.personalInfo.linkedin}
              </a>
            </div>
          </div>
        </div>

        {/* Pas Foto 3x4 di Kanan */}
        <div className="shrink-0 self-center sm:self-start">
          <div className="w-[84px] h-[112px] rounded-md overflow-hidden border border-slate-300 shadow-2xs bg-slate-100 flex items-center justify-center">
            <img
              src="/identitas/pas-foto-3x4.webp"
              alt={cvData.personalInfo.fullName}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="pb-2.5 mb-2 border-b border-slate-200 text-center">
      <h1 className="text-xl sm:text-2xl md:text-[26px] tracking-tight uppercase leading-tight font-extrabold text-[#0F172A] break-words">
        {cvData.personalInfo.fullName}
      </h1>

      {activeHeadline && activeHeadline.trim() ? (
        <p className="text-xs sm:text-[13px] tracking-tight font-bold text-[#0F172A] break-words">
          {activeHeadline}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-600 mt-2.5 font-normal">
        <span>{cvData.personalInfo.phone}</span>
        <span className="text-slate-300">|</span>
        <a href={`mailto:${cvData.personalInfo.email}`} className="text-slate-900 hover:underline">
          {cvData.personalInfo.email}
        </a>
        <span className="text-slate-300">|</span>
        <a href={`https://${cvData.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline font-bold">
          {cvData.personalInfo.linkedin}
        </a>
        <span className="text-slate-300">|</span>
        <a href={`https://${cvData.personalInfo.website}`} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline font-medium">
          {cvData.personalInfo.website}
        </a>
      </div>
    </header>
  );
};
export const Header = AtsHeader;

export const AtsSummary: React.FC<AtsSectionProps> = ({
  items,
  language,
  renderSectionHeader,
  summaryText,
  cvData,
  preset,
  textAlign = 'left',
}) => {
  if (!items.summary) return null;

  const canonicalPreset = (preset && resolvePresetFromQuery(preset)) || preset;
  const activeSummary =
    summaryText ||
    (canonicalPreset && PRESET_SUMMARIES[canonicalPreset]?.[language]) ||
    (preset && PRESET_SUMMARIES[preset]?.[language]) ||
    cvData.personalInfo.summary;

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Professional Summary' : 'Ringkasan')}
      <p className={`text-[13px] text-slate-700 leading-relaxed font-normal ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
        {activeSummary}
      </p>
    </section>
  );
};
export const Summary = AtsSummary;

export const AtsMetrics: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, sectionOrders, preset, textAlign = 'left' }) => {
  if (!Object.values(items.metrics).some(Boolean)) return null;
  
  const tailoredMetrics = getTailoredMetrics(preset, language, items.certifications);

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Key Metrics & Highlights' : 'Sorotan Kinerja & Metrik Kunci')}
      <ul className="space-y-1.5 text-[13px] text-slate-800">
        {tailoredMetrics
          .map((m, idx) => ({
            idx,
            text: `${m.value} ${m.label} : ${m.sublabel}`,
          }))
          .filter((m) => items.metrics[m.idx])
          .sort((a, b) => (sectionOrders.metrics.indexOf(a.idx) !== -1 ? sectionOrders.metrics.indexOf(a.idx) : 999) - (sectionOrders.metrics.indexOf(b.idx) !== -1 ? sectionOrders.metrics.indexOf(b.idx) : 999))
          .map((m) => {
            const colonIdx = m.text.indexOf(':');
            const prefix = colonIdx !== -1 ? m.text.substring(0, colonIdx + 1) : m.text;
            const rest = colonIdx !== -1 ? m.text.substring(colonIdx + 1).trim() : '';
            return (
              <li key={m.idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                <p className={`flex-1 min-w-0 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                  <strong className="font-bold text-[#0F172A]">{prefix}</strong>{' '}
                  <span className="font-normal text-slate-700">{rest}</span>
                </p>
              </li>
            );
          })}
      </ul>
    </section>
  );
};
export const Metrics = AtsMetrics;

export const AtsExperiences: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, sectionOrders, preset, textAlign = 'left' }) => {
  if (!Object.values(items.experiences).some(Boolean)) return null;
  
  const tailoredExperiences = getTailoredExperiences(preset, language);

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Work Experience' : 'Pengalaman Kerja')}
      <div className="space-y-3">
        {tailoredExperiences
          .filter((exp) => items.experiences[exp.id])
          .sort((a, b) => (sectionOrders.experiences.indexOf(a.id) !== -1 ? sectionOrders.experiences.indexOf(a.id) : 999) - (sectionOrders.experiences.indexOf(b.id) !== -1 ? sectionOrders.experiences.indexOf(b.id) : 999))
          .map((exp) => (
            <div key={exp.id} className="space-y-1 print:break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold text-[#0F172A] uppercase">
                  {exp.company}
                </h3>
                <span className="text-xs font-bold text-slate-800 shrink-0 ml-2">
                  {exp.period} | {exp.location}
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <div className="text-[13px] font-bold text-slate-800">
                  {exp.role}
                </div>
              </div>

              <ul className="space-y-1 text-[13px] text-slate-800 pt-0.5">
                {exp.highlights.map((hl, idx) => {
                  const renderContent = () => {
                    if (hl.includes('**')) {
                      const parts = hl.split(/(\*\*[^*]+\*\*)/g);
                      return parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                          return (
                            <strong key={i} className="font-bold text-[#0F172A]">
                              {part.slice(2, -2)}
                            </strong>
                          );
                        }
                        return <React.Fragment key={i}>{part}</React.Fragment>;
                      });
                    }
                    return hl;
                  };

                  return (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                      <p className={`flex-1 min-w-0 font-normal text-slate-700 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                        {renderContent()}
                      </p>
                    </li>
                  );
                })}
                {exp.tools && exp.tools.length > 0 && (
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                    <p className={`flex-1 min-w-0 text-slate-700 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                      <strong className="font-bold text-[#0F172A]">Tools & Platform :</strong> {exp.tools.join(', ')}
                    </p>
                  </li>
                )}
              </ul>
            </div>
          ))}
      </div>
    </section>
  );
};
export const Experiences = AtsExperiences;

export const AtsEducation: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, cvData, sectionOrders, textAlign = 'left' }) => {
  if (!Object.values(items.education).some(Boolean)) return null;

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Education' : 'Pendidikan')}
      <div className="space-y-3.5">
        {cvData.education
          .map((edu, idx) => ({ ...edu, idx }))
          .filter((edu) => items.education[edu.idx])
          .sort((a, b) => (sectionOrders.education.indexOf(a.idx) !== -1 ? sectionOrders.education.indexOf(a.idx) : 999) - (sectionOrders.education.indexOf(b.idx) !== -1 ? sectionOrders.education.indexOf(b.idx) : 999))
          .map((edu, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <strong className="font-bold text-[#0F172A] uppercase text-sm">
                  {edu.institution}
                </strong>
                <span className="text-xs text-slate-800 font-bold shrink-0 ml-2 text-right">
                  {edu.period}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <div className="text-[13px] font-bold text-slate-800">
                  {edu.degree}
                </div>
                {edu.gpa && (
                  <div className="text-xs font-semibold text-slate-700 shrink-0 ml-2 text-right">
                    {language === 'en' ? 'GPA' : 'IPK'} : {edu.gpa}{edu.predicate ? ` • ${edu.predicate}` : ''}
                  </div>
                )}
              </div>
              {edu.detail && (
                <p className={`text-xs text-slate-600 font-normal leading-relaxed pt-0.5 ${textAlign === 'justify' ? 'text-justify' : 'text-left'}`}>
                  {edu.detail}
                </p>
              )}
            </div>
          ))}
      </div>
    </section>
  );
};
export const Education = AtsEducation;

export const AtsSkills: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, cvData, sectionOrders, textAlign = 'left' }) => {
  const hasHardSkills = items.skills?.hardGroup && Object.values(items.skills.hard || {}).some(Boolean);
  const hasSoftSkills = items.skills?.softGroup && Object.values(items.skills.soft || {}).some(Boolean);
  const hasTools = items.skills?.toolsGroup && Object.values(items.skills.tools || {}).some(Boolean);

  if (!hasHardSkills && !hasSoftSkills && !hasTools) return null;

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Core Competencies & Skills' : 'Keahlian')}
      <div className="space-y-3">
        {items.skills.hardGroup && Object.values(items.skills.hard || {}).some(Boolean) && (
          <div>
            <div className="text-[12.5px] font-bold text-black uppercase tracking-wider mb-1">
              {language === 'en' ? 'HARD SKILLS' : 'HARD SKILL'}
            </div>
            <ul className="space-y-1 text-[13px] text-slate-800">
              {cvData.skills.hard
                .map((group, idx) => ({ ...group, idx }))
                .filter((g) => items.skills.hard?.[g.idx])
                .sort((a, b) => {
                  const idxA = sectionOrders?.skills_hard?.indexOf(a.idx) ?? -1;
                  const idxB = sectionOrders?.skills_hard?.indexOf(b.idx) ?? -1;
                  return (idxA !== -1 ? idxA : a.idx) - (idxB !== -1 ? idxB : b.idx);
                })
                .map((group) => (
                  <li key={group.idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                    <p className={`flex-1 min-w-0 font-normal text-slate-700 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                      <strong className="font-bold text-[#0F172A]">{group.category} :</strong>{' '}
                      {group.items.join(', ')}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {items.skills.softGroup && Object.values(items.skills.soft || {}).some(Boolean) && (
          <div>
            <div className="text-[12.5px] font-bold text-black uppercase tracking-wider mb-1">
              {language === 'en' ? 'SOFT SKILLS' : 'SOFT SKILL'}
            </div>
            <ul className="space-y-1 text-[13px] text-slate-800">
              {cvData.skills.soft
                .map((item, idx) => ({ item, idx }))
                .filter((s) => items.skills.soft?.[s.idx])
                .sort((a, b) => {
                  const idxA = sectionOrders?.skills_soft?.indexOf(a.idx) ?? -1;
                  const idxB = sectionOrders?.skills_soft?.indexOf(b.idx) ?? -1;
                  return (idxA !== -1 ? idxA : a.idx) - (idxB !== -1 ? idxB : b.idx);
                })
                .map(({ item, idx }) => {
                  const colonIdx = item.indexOf(':');
                  if (colonIdx !== -1) {
                    const prefix = item.substring(0, colonIdx).trim() + ' :';
                    const rest = item.substring(colonIdx + 1);
                    return (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                        <p className={`flex-1 min-w-0 font-normal text-slate-700 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                          <strong className="font-bold text-[#0F172A]">{prefix}</strong>{' '}
                          {rest.trim()}
                        </p>
                      </li>
                    );
                  }
                  return (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                      <p className={`flex-1 min-w-0 font-normal text-slate-700 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>{item}</p>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}

        {items.skills.toolsGroup && Object.values(items.skills.tools || {}).some(Boolean) && (
          <div>
            <div className="text-[12.5px] font-bold text-black uppercase tracking-wider mb-1">
              {language === 'en' ? 'TOOLS & ECOSYSTEM' : 'TOOLS & EKOSISTEM'}
            </div>
            <ul className="space-y-1 text-[13px] text-slate-800">
              {(cvData.skills.toolCategories || [])
                .map((cat, idx) => ({ ...cat, idx }))
                .filter((c) => items.skills.tools?.[c.idx])
                .sort((a, b) => {
                  const idxA = sectionOrders?.skills_tools?.indexOf(a.idx) ?? -1;
                  const idxB = sectionOrders?.skills_tools?.indexOf(b.idx) ?? -1;
                  return (idxA !== -1 ? idxA : a.idx) - (idxB !== -1 ? idxB : b.idx);
                })
                .map((cat) => (
                  <li key={cat.idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                    <p className={`flex-1 min-w-0 font-normal text-slate-700 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                      <strong className="font-bold text-[#0F172A]">{cat.category} :</strong> {cat.tools}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
export const Skills = AtsSkills;

export const AtsCertifications: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, cvData, sectionOrders, textAlign = 'left' }) => {
  if (!Object.values(items.certifications).some(Boolean) || !cvData.certifications) return null;

  return (
    <section className="mb-3.5 print:break-inside-avoid">
      {renderSectionHeader(language === 'en' ? 'Certifications' : 'Sertifikasi')}
      <div className="space-y-2.5">
        {cvData.certifications
          .filter((cert) => items.certifications[cert.id])
          .sort((a, b) => (sectionOrders.certifications.indexOf(a.id) !== -1 ? sectionOrders.certifications.indexOf(a.id) : 999) - (sectionOrders.certifications.indexOf(b.id) !== -1 ? sectionOrders.certifications.indexOf(b.id) : 999))
          .map((cert) => {
            const rightTop = cert.grade || cert.period;
            const rightBottom = cert.credentialSub || (cert.grade && cert.period ? cert.period : '');
            return (
              <div key={cert.id} className="space-y-0.5 print:break-inside-avoid">
                <div className="flex justify-between items-baseline gap-2">
                  <strong className="font-bold text-[#0F172A] text-[13px]">
                    {cert.title}
                  </strong>
                  {rightTop && (
                    <span className="text-xs text-slate-800 font-bold shrink-0 ml-2">
                      {rightTop}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <div className="text-xs font-bold text-slate-700">
                    {cert.issuer}
                  </div>
                  {rightBottom && (
                    <span className="text-xs text-slate-700 font-semibold shrink-0 ml-2">
                      {rightBottom}
                    </span>
                  )}
                </div>
                {cert.description && (
                  <p className={`text-[13px] text-slate-700 font-normal leading-relaxed pt-0.5 ${textAlign === 'justify' ? 'text-justify' : 'text-left'}`}>
                    {cert.description}
                  </p>
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
};
export const Certifications = AtsCertifications;

export const AtsConsultingProjects: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, sectionOrders, preset, textAlign = 'left' }) => {
  if (!Object.values(items.consultingProjects).some(Boolean)) return null;

  const tailoredConsulting = getTailoredConsulting(preset, language);

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Independent Project Consulting' : 'Konsultan Proyek Independen')}
      <p className={`text-[13px] text-slate-700 leading-relaxed font-normal mb-2 ${textAlign === 'justify' ? 'text-justify' : 'text-left'}`}>
        {tailoredConsulting.summary}
      </p>

      <div className="space-y-3">
        {(tailoredConsulting.projects || [])
          .filter((proj) => items.consultingProjects[proj.id])
          .sort((a, b) => {
            const idxA = sectionOrders.consultingProjects?.indexOf(a.id) ?? -1;
            const idxB = sectionOrders.consultingProjects?.indexOf(b.id) ?? -1;
            return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
          })
          .map((proj) => (
            <div key={proj.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[12.5px] font-bold text-[#0F172A] uppercase">
                  {proj.organization}
                </h3>
                <span className="text-xs font-bold text-slate-800 shrink-0 ml-2">
                  {proj.periodType}{proj.sector ? ` | ${proj.sector}` : ''}
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-800">
                  {proj.role}
                </span>
              </div>

              <ul className="space-y-1 text-[13px] text-slate-800 pt-0.5">
                {proj.highlights.map((hl, hlIdx) => {
                  const renderContent = () => {
                    if (hl.includes('**')) {
                      const parts = hl.split(/(\*\*[^*]+\*\*)/g);
                      return parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                          return (
                            <strong key={i} className="font-bold text-[#0F172A]">
                              {part.slice(2, -2)}
                            </strong>
                          );
                        }
                        return <React.Fragment key={i}>{part}</React.Fragment>;
                      });
                    }
                    return hl;
                  };

                  return (
                    <li key={hlIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                      <p className={`flex-1 min-w-0 font-normal text-slate-700 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                        {renderContent()}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
      </div>
    </section>
  );
};
export const ConsultingProjects = AtsConsultingProjects;

export const AtsDigitalSolutions: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, sectionOrders, preset, textAlign = 'left' }) => {
  if (!Object.values(items.digitalSolutions).some(Boolean)) return null;

  const tailoredDigitalSolutions = getTailoredDigitalSolutions(preset, language);

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Digital Portfolio' : 'Portofolio Digital')}
      <p className={`text-[13px] text-slate-700 leading-relaxed font-normal mb-2 ${textAlign === 'justify' ? 'text-justify' : 'text-left'}`}>
        {language === 'en'
          ? 'All web-based system prototypes are designed as live testing prototypes ready for customization according to corporate workflows and operational scale :'
          : 'Seluruh prototipe sistem berbasis web ini dirancang sebagai kerangka kerja awal (live testing prototype) yang siap dikustomisasi sesuai alur kerja dan skala operasional perusahaan :'}
      </p>

      <ul className="space-y-1.5 text-[13px] text-slate-800">
        {tailoredDigitalSolutions
          .filter((sol) => items.digitalSolutions[sol.id])
          .sort((a, b) => (sectionOrders.digitalSolutions.indexOf(a.id) !== -1 ? sectionOrders.digitalSolutions.indexOf(a.id) : 999) - (sectionOrders.digitalSolutions.indexOf(b.id) !== -1 ? sectionOrders.digitalSolutions.indexOf(b.id) : 999))
          .map((sol) => (
            <li key={sol.id} className="leading-relaxed">
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <strong className="font-bold text-[#0F172A]">
                    {sol.title}{sol.subtitle ? ` - ${sol.subtitle}` : ''}
                  </strong>
                </div>
                <p className={`font-normal text-slate-700 mt-0.5 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                  {sol.description}
                  {sol.impact && (
                    <span>
                      {' '}
                      <strong className="text-slate-900 font-bold">{language === 'en' ? 'Impact :' : 'Dampak :'}</strong>{' '}
                      <span className="text-slate-700 font-normal">{sol.impact}</span>
                    </span>
                  )}
                </p>
                {sol.demoUrl && (
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    <strong className="text-slate-800">Link & Demo :</strong>{' '}
                    <a href={sol.demoUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">
                      {sol.demoUrl}
                    </a>
                  </div>
                )}
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
};
export const DigitalSolutions = AtsDigitalSolutions;

export const AtsOrganizations: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, sectionOrders, preset, textAlign = 'left' }) => {
  if (!Object.values(items.organizations).some(Boolean)) return null;

  const tailoredOrganizations = getTailoredOrganizations(preset, language);

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Organizational Leadership' : 'Pengalaman Organisasi & Kepemimpinan')}
      <div className="space-y-2">
        {tailoredOrganizations
          .map((org, idx) => ({ ...org, idx }))
          .filter((org) => items.organizations[org.idx])
          .sort((a, b) => (sectionOrders.organizations.indexOf(a.idx) !== -1 ? sectionOrders.organizations.indexOf(a.idx) : 999) - (sectionOrders.organizations.indexOf(b.idx) !== -1 ? sectionOrders.organizations.indexOf(b.idx) : 999))
          .map((org, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between items-baseline">
                <strong className="font-bold text-[#0F172A] text-[13px]">
                  {org.role}
                </strong>
                <span className="text-xs text-slate-800 font-bold shrink-0 ml-2">
                  {org.period}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-700">
                {org.organization}
              </div>
              {org.description && (
                <p className={`text-[13px] text-slate-700 font-normal leading-relaxed ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                  {org.description}
                </p>
              )}
            </div>
          ))}
      </div>
    </section>
  );
};
export const Organizations = AtsOrganizations;

export const AtsAchievements: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, cvData, sectionOrders, preset, textAlign = 'left' }) => {
  if (!Object.values(items.achievements).some(Boolean)) return null;

  const countEn = preset === 'all'
    ? cvData.achievements.filter((a) => items.achievements[a.id]).length
    : cvData.achievements.filter((a) => items.achievements[a.id]).slice(0, 5).length;
    
  const countId = preset === 'all'
    ? cvData.achievements.filter((a) => items.achievements[a.id]).length
    : cvData.achievements.filter((a) => items.achievements[a.id]).slice(0, 5).length;

  return (
    <section className="mb-3.5 print:break-inside-avoid">
      {renderSectionHeader(
        language === 'en'
          ? `Honors, Awards & Achievements (${countEn} Items)`
          : `Prestasi, Penghargaan & Pencapaian (${countId} Kegiatan)`
      )}
      <div className="space-y-2">
        {(preset === 'all'
          ? cvData.achievements
              .filter((ach) => items.achievements[ach.id])
              .sort((a, b) => (sectionOrders.achievements.indexOf(a.id) !== -1 ? sectionOrders.achievements.indexOf(a.id) : 999) - (sectionOrders.achievements.indexOf(b.id) !== -1 ? sectionOrders.achievements.indexOf(b.id) : 999))
          : cvData.achievements
              .filter((ach) => items.achievements[ach.id])
              .sort((a, b) => (sectionOrders.achievements.indexOf(a.id) !== -1 ? sectionOrders.achievements.indexOf(a.id) : 999) - (sectionOrders.achievements.indexOf(b.id) !== -1 ? sectionOrders.achievements.indexOf(b.id) : 999))
              .slice(0, 5)
        ).map((ach) => (
            <div key={ach.id} className="space-y-0.5 print:break-inside-avoid">
              <div className="flex justify-between items-baseline gap-2">
                <strong className="font-bold text-[#0F172A] text-[13px]">
                  {ach.title}
                </strong>
                <span className="text-xs text-slate-800 font-bold shrink-0 ml-2">
                  {language === 'en' ? `${ach.level} Level` : `Tingkat ${ach.level}`}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <div className="text-xs font-bold text-slate-700">
                  {ach.organization}
                </div>
                <span className="text-xs text-slate-700 font-bold shrink-0 ml-2">
                  {ach.year}
                </span>
              </div>
              {ach.description && (
                <p className={`text-[13px] text-slate-700 font-normal leading-relaxed ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                  {ach.description.includes('**')
                    ? ach.description.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                        part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
                          <strong key={i} className="font-bold text-[#0F172A]">
                            {part.slice(2, -2)}
                          </strong>
                        ) : (
                          part
                        )
                      )
                    : ach.description}
                </p>
              )}
            </div>
          ))}
      </div>
    </section>
  );
};
export const Achievements = AtsAchievements;

/* ==========================================================================
   MAIN ATS DOCUMENT SHEET ORCHESTRATOR
   ========================================================================== */

export const AtsDocumentSheet: React.FC<AtsDocumentSheetProps> = ({
  cvData,
  items,
  language,
  totalActiveItems,
  sectionOrders,
  headline,
  summaryText,
  designPreset = 'block',
  preset,
  textAlign = 'left',
  headerColor = '#0F172A',
}) => {
  const renderSectionHeader = (title: string) => {
    if (designPreset === 'line') {
      return (
        <div className="border-b-2 border-slate-800 pb-1 mb-2 mt-4 flex items-center justify-between">
          <h2 className="text-[12px] sm:text-[13px] font-extrabold uppercase tracking-wider" style={{ color: headerColor }}>
            {title}
          </h2>
        </div>
      );
    }
    
    if (designPreset === 'modern') {
      return (
        <div className="mb-2 mt-4 flex items-center justify-between">
          <h2 className="text-[12px] sm:text-[13px] font-extrabold uppercase tracking-wider" style={{ color: headerColor }}>
            {title}
          </h2>
        </div>
      );
    }

    if (designPreset === 'plain') {
      return (
        <div className="mb-2 mt-4 flex items-center justify-between">
          <h2 className="text-[12px] sm:text-[13px] font-extrabold uppercase tracking-wider" style={{ color: headerColor }}>
            {title}
          </h2>
        </div>
      );
    }
    
    if (designPreset === 'badge') {
      return (
        <div className="mb-2 mt-4 flex items-start">
          <div className="px-2.5 py-1 rounded-[2px] inline-flex items-center" style={{ backgroundColor: headerColor }}>
            <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
              {title}
            </h2>
          </div>
        </div>
      );
    }
    
    // Default: 'block'
    return (
      <div className="text-white px-2.5 py-1 mb-2 mt-3 rounded-[2px] flex items-center justify-between" style={{ backgroundColor: headerColor }}>
        <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
          {title}
        </h2>
      </div>
    );
  };

  const sharedProps = {
    cvData,
    items,
    language,
    sectionOrders,
    renderSectionHeader,
    designPreset,
    preset,
    headline,
    summaryText,
    textAlign,
  };

  return (
    <div
      id="ats-document-root"
      className="bg-white p-4 sm:p-7 md:p-9 shadow-xl print:shadow-none border border-slate-200/90 print:border-none print:p-0 font-sans transition-all duration-200 mx-auto w-full max-w-3xl text-slate-900 rounded-lg overflow-x-clip select-text"
      style={{ minHeight: '297mm' }}
    >
      <AtsHeader {...sharedProps} />
      <AtsSummary {...sharedProps} />
      <AtsMetrics {...sharedProps} />
      <AtsExperiences {...sharedProps} />
      <AtsEducation {...sharedProps} />
      <AtsSkills {...sharedProps} />
      <AtsCertifications {...sharedProps} />
      <AtsConsultingProjects {...sharedProps} />
      <AtsDigitalSolutions {...sharedProps} />
      <AtsOrganizations {...sharedProps} />
      <AtsAchievements {...sharedProps} />

      {totalActiveItems === 0 && (
        <div className="py-16 text-center text-slate-400">
          <svg className="w-12 h-12 mx-auto text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><polyline points="16 8 10 14 8 12"/></svg>
          <p className="text-sm font-semibold text-slate-600">
            {language === 'en' ? 'No items selected.' : 'Belum ada item yang dipilih.'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'en' ? 'Please check at least one item above to build your PDF.' : 'Silakan centang minimal satu item di atas untuk membuat CV PDF Anda.'}
          </p>
        </div>
      )}
    </div>
  );
};

export const DocumentSheet = AtsDocumentSheet;
export default AtsDocumentSheet;
