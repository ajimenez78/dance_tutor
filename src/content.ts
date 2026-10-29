import { lessons, styles } from "./lessons";
import { spanishLessons } from "./lessons.es";
import { useLanguage } from "./i18n";

export function useContent() {
  const { language } = useLanguage();
  return {
    lessons: language === "es" ? spanishLessons : lessons,
    styles:
      language === "es"
        ? {
            salsa: {
              ...styles.salsa,
              feel: "Un poco de energía. Mucha alegría.",
              description:
                "Encuentra el ritmo, aprende los básicos y dale un poco más de energía a tu día.",
              timing: "Paso, paso, paso, pausa.",
            },
            bachata: {
              ...styles.bachata,
              feel: "Baja el ritmo. Déjate llevar por la música.",
              description:
                "Empieza con un sencillo paso lateral y descubre lo que se siente al moverte con la música.",
              timing: "Paso, paso, paso, toque.",
            },
          }
        : styles,
  };
}
