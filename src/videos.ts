import type { Language } from "./i18n";

// Spoken-language versions verified against creator pages and YouTube oEmbed.
// Related lessons share a demonstration; each lesson supplies its own focus.
export type Tutorial = {
  youtubeId: string;
  author: string;
  source: string;
  audioLanguage: Language;
};
const salsaPractice: Tutorial = {
  audioLanguage: "en",
  youtubeId: "Ns5TaVGv6uY",
  author: "Dance Dojo",
  source:
    "https://thedancedojo.com/blog/10-minute-salsa-basics-practice-at-home/",
};
const bachataBasics: Tutorial = {
  audioLanguage: "en",
  youtubeId: "xhrdh-uFkog",
  author: "Bachata Dance Academy",
  source: "https://www.youtube.com/watch?v=xhrdh-uFkog",
};
const spanishSalsa: Tutorial = {
  youtubeId: "IbBBYxbtz-w",
  author: "Alfonso y Mónica",
  source: "https://www.youtube.com/watch?v=IbBBYxbtz-w",
  audioLanguage: "es",
};
const spanishBachata: Tutorial = {
  youtubeId: "DcgSb1aYUO0",
  author: "Alfonso y Mónica",
  source: "https://www.youtube.com/watch?v=DcgSb1aYUO0",
  audioLanguage: "es",
};
export const tutorials: Record<string, Record<Language, Tutorial>> = {
  "salsa-rhythm": {
    es: spanishSalsa,
    en: {
      audioLanguage: "en",
      youtubeId: "dYgGFqTsD9I",
      author: "Dance Dojo",
      source:
        "https://thedancedojo.com/blog/how-to-find-the-beat-in-salsa-music/",
    },
  },
  "salsa-basic": { es: spanishSalsa, en: salsaPractice },
  "salsa-side": { es: spanishSalsa, en: salsaPractice },
  "salsa-flow": { es: spanishSalsa, en: salsaPractice },
  "bachata-rhythm": {
    es: spanishBachata,
    en: {
      audioLanguage: "en",
      youtubeId: "lWKpxPYT8D4",
      author: "Daniel y Tom BACHATA GROOVE",
      source: "https://www.youtube.com/watch?v=lWKpxPYT8D4",
    },
  },
  "bachata-side": { es: spanishBachata, en: bachataBasics },
  "bachata-tap": { es: spanishBachata, en: bachataBasics },
  "bachata-flow": { es: spanishBachata, en: bachataBasics },
};
