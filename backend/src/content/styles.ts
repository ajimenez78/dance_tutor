import type { Language, Style, StyleInfo } from "./types";

export const styles: Record<Language, Record<Style, StyleInfo>> = {
  en: {
    salsa: {
      name: "Salsa",
      feel: "A little energy. A lot of joy.",
      description:
        "Find the beat, learn the basics, and bring a little more energy to your day.",
      timing: "Step, step, step, hold.",
      source: "https://thedancedojo.com/how-to-salsa-dance-for-beginners/",
    },
    bachata: {
      name: "Bachata",
      feel: "Slow down. Settle into the music.",
      description:
        "Start with a simple side step and discover the beauty of moving with the music.",
      timing: "Step, step, step, tap.",
      source: "https://thedancedojo.com/bachata-basic-step/",
    },
  },
  es: {
    salsa: {
      name: "Salsa",
      feel: "Un poco de energía. Mucha alegría.",
      description:
        "Encuentra el ritmo, aprende los básicos y dale un poco más de energía a tu día.",
      timing: "Paso, paso, paso, pausa.",
      source: "https://thedancedojo.com/how-to-salsa-dance-for-beginners/",
    },
    bachata: {
      name: "Bachata",
      feel: "Baja el ritmo. Déjate llevar por la música.",
      description:
        "Empieza con un sencillo paso lateral y descubre lo que se siente al moverte con la música.",
      timing: "Paso, paso, paso, toque.",
      source: "https://thedancedojo.com/bachata-basic-step/",
    },
  },
};
