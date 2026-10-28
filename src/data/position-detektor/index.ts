import { PresetMatchingRule } from './types';
import { ALL_IN_RULES } from './in';
import { ALL_EN_RULES } from './en';

export * from './types';

// Modular Language & Domain Exports:
// src/data/position-detektor/in/<bidang>.ts (e.g. hr.ts, sales.ts, tech.ts)
// src/data/position-detektor/en/<bidang>.ts (e.g. hr.ts, sales.ts, tech.ts)
export * as inDetectors from './in';
export * as enDetectors from './en';
export * from './in';
export * from './en';

// Processing Engines
export * from './synonymEngine';

/**
 * Menggabungkan aturan pencocokan bilingual (Indonesia & English) berdasarkan kode peran (code).
 * Mengintegrasikan seluruh exactPhrases, strongKeywords, secondaryKeywords, negativeKeywords,
 * dan mustIncludeAny secara menyeluruh tanpa duplikasi.
 */
function mergeBilingualRules(inRules: PresetMatchingRule[], enRules: PresetMatchingRule[]): PresetMatchingRule[] {
  const ruleMap = new Map<string, PresetMatchingRule>();

  const addRule = (rule: PresetMatchingRule) => {
    const existing = ruleMap.get(rule.code);
    if (!existing) {
      ruleMap.set(rule.code, {
        key: rule.key,
        code: rule.code,
        exactPhrases: Array.from(new Set(rule.exactPhrases || [])),
        strongKeywords: Array.from(new Set(rule.strongKeywords || [])),
        secondaryKeywords: rule.secondaryKeywords ? Array.from(new Set(rule.secondaryKeywords)) : undefined,
        negativeKeywords: rule.negativeKeywords ? Array.from(new Set(rule.negativeKeywords)) : undefined,
        mustIncludeAny: rule.mustIncludeAny ? Array.from(new Set(rule.mustIncludeAny)) : undefined,
      });
    } else {
      ruleMap.set(rule.code, {
        key: existing.key || rule.key,
        code: rule.code,
        exactPhrases: Array.from(new Set([...(existing.exactPhrases || []), ...(rule.exactPhrases || [])])),
        strongKeywords: Array.from(new Set([...(existing.strongKeywords || []), ...(rule.strongKeywords || [])])),
        secondaryKeywords: Array.from(new Set([...(existing.secondaryKeywords || []), ...(rule.secondaryKeywords || [])])),
        negativeKeywords: Array.from(new Set([...(existing.negativeKeywords || []), ...(rule.negativeKeywords || [])])),
        mustIncludeAny: (existing.mustIncludeAny || rule.mustIncludeAny)
          ? Array.from(new Set([...(existing.mustIncludeAny || []), ...(rule.mustIncludeAny || [])]))
          : undefined,
      });
    }
  };

  inRules.forEach(addRule);
  enRules.forEach(addRule);

  return Array.from(ruleMap.values());
}

export const BILINGUAL_PRESET_RULES: PresetMatchingRule[] = mergeBilingualRules(ALL_IN_RULES, ALL_EN_RULES);

export * from './matcher';
export * from './cvKeywordAdapter';
