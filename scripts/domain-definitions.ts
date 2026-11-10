export interface DomainRoleDefinition {
  key: string;
  code: string;
  basesIn: string[];
  basesEn: string[];
  strongIn: string[];
  strongEn: string[];
  secondaryIn?: string[];
  secondaryEn?: string[];
  negativeIn?: string[];
  negativeEn?: string[];
  mustIncludeIn?: string[];
  mustIncludeEn?: string[];
}

export interface DomainMetadata {
  domain: string; // e.g. 'hr', 'operations', 'admin'
  nameIn: string;
  nameEn: string;
  roles: DomainRoleDefinition[];
  synonymsIn: Record<string, string[]>;
  synonymsEn: Record<string, string[]>;
}
