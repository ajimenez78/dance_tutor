import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { spanish } from "./translations";

export type Language = "es" | "en";
export const LANGUAGE_KEY = "ritmo-language";
export function loadLanguage(): Language {
  try {
    return localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}
export function translate(
  language: Language,
  message: string,
  values: Record<string, string | number> = {},
) {
  const text = language === "es" ? (spanish[message] ?? message) : message;
  return text.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? `{${key}}`),
  );
}
const LanguageContext = createContext({
  language: "es" as Language,
  setLanguage: (_language: Language) => {},
  t: (message: string, values?: Record<string, string | number>) =>
    translate("es", message, values),
});
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(loadLanguage);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      language === "es"
        ? "Ritmo — Tu práctica diaria de baile"
        : "Ritmo — Your daily dance practice";
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      "content",
      language === "es"
        ? "Aprende salsa y bachata con pequeñas lecciones y una práctica diaria a tu ritmo."
        : "Learn Salsa and Bachata with small lessons and daily practice at your own pace.",
    );
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      /* Progress storage reports unavailable browser storage. */
    }
  }, [language]);
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: (message, values) => translate(language, message, values),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  return useContext(LanguageContext);
}
export function LanguagePicker() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <label className="language-picker">
      <span>{t("Language")}</span>
      <select
        aria-label={t("Language")}
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
      >
        <option value="es" lang="es">
          Español
        </option>
        <option value="en" lang="en">
          English
        </option>
      </select>
    </label>
  );
}
