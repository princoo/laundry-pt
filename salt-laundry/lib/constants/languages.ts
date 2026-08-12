export const LANGUAGE_CODES = ["EN", "FR", "RW"] as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export interface LanguageOption {
  code: LanguageCode;
  // What the nav button shows once selected- kept short so the bar stays tight.
  short: string;
  // Full name, shown in the dropdown list.
  label: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "EN", short: "EN", label: "English" },
  { code: "FR", short: "FR", label: "Français" },
  { code: "RW", short: "KINY", label: "Kinyarwanda" },
];

export const DEFAULT_LANGUAGE: LanguageCode = "EN";

export const LANGUAGE_STORAGE_KEY = "salt-language";
