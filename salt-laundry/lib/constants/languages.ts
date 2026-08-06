export const LANGUAGE_CODES = ['EN', 'FR', 'RW'] as const

export type LanguageCode = (typeof LANGUAGE_CODES)[number]

export interface LanguageOption {
  code: LanguageCode
  // What the nav button shows once selected — kept short so the bar stays tight.
  short: string
  // Full name, shown in the dropdown list.
  label: string
  // Emoji flag of the country the language is associated with.
  flag: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'EN', short: 'EN', label: 'English', flag: '🇬🇧' },
  { code: 'FR', short: 'FR', label: 'Français', flag: '🇫🇷' },
  { code: 'RW', short: 'KINY', label: 'Kinyarwanda', flag: '🇷🇼' },
]

export const DEFAULT_LANGUAGE: LanguageCode = 'EN'

export const LANGUAGE_STORAGE_KEY = 'salt-language'
