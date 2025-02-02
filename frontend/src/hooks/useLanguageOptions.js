import i18n from "@/i18n";
import { resources as languages } from "@/locales/resources";

const nativeLanguageNames = {
  zh: "简体中文",
  "zh-tw": "繁體中文",
  en: "English",
  ko: "한국어",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ru: "Русский",
  it: "Italiano",
  pt: "Português",
  he: "עברית",
  nl: "Nederlands",
  vi: "Tiếng Việt",
  fa: "فارسی",
};

export function useLanguageOptions() {
  const supportedLanguages = Object.keys(languages);
  const changeLanguage = (newLang = "en") => {
    if (!Object.keys(languages).includes(newLang)) return false;
    i18n.changeLanguage(newLang);
  };

  const getLanguageName = (lang = "zh") => {
    return nativeLanguageNames[lang] || lang;
  };

  return {
    currentLanguage: i18n.language || "zh",
    supportedLanguages,
    getLanguageName,
    changeLanguage,
  };
}
