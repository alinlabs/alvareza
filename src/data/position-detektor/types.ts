export interface PresetMatchingRule {
  key: string;
  code: string;
  /**
   * Frasa persis / gabungan kata kunci spesifik (Indonesian & English).
   * Bobot tertinggi (+350 jika identik, +260 jika cocok boundary)
   */
  exactPhrases: string[];
  /**
   * Kata kunci kuat yang khas untuk peran ini (+65 per kecocokan).
   */
  strongKeywords: string[];
  /**
   * Kata kunci pendukung (+25 per kecocokan).
   */
  secondaryKeywords?: string[];
  /**
   * Kata kunci negatif / diskualifikasi (-200 per kecocokan).
   * Mencegah preset umum merebut peran spesifik.
   */
  negativeKeywords?: string[];
  /**
   * Syarat mutlak: salah satu dari kata kunci ini HARUS ada agar aturan ini aktif.
   */
  mustIncludeAny?: string[];
}
