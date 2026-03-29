export interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "zh", name: "中文" },
  { code: "hi", name: "हिन्दी" },
  { code: "ar", name: "العربية" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "pt", name: "Português" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "ru", name: "Русский" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "tl", name: "Filipino" },
  { code: "uk", name: "Українська" },
  { code: "bn", name: "বাংলা" },
  { code: "sw", name: "Kiswahili" },
  { code: "it", name: "Italiano" },
  { code: "tr", name: "Türkçe" },
  { code: "th", name: "ไทย" },
];

export default languages;
