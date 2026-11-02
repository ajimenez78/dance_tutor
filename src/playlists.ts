import type { Language } from "./i18n";
import { bachataPlaylist, bachataPlaylistUrl } from "./bachataPlaylist";
import type { BachataPlaylistLevel } from "./bachataPlaylist";
import type { Style } from "./lessons";

export type PlaylistLevel = BachataPlaylistLevel;
export type PlaylistVideo = readonly [
  id: string,
  title: string,
  level: PlaylistLevel,
];

export type LearningPlaylist = {
  attribution: string;
  title: string;
  description: string;
  url: string;
  videos: readonly PlaylistVideo[];
};

export const playlistLevels: readonly PlaylistLevel[] = [
  "initial",
  "foundations",
  "intermediate",
];

export const playlists: Record<
  Style,
  Record<Language, LearningPlaylist>
> = {
  bachata: {
    es: {
      attribution: "Alfonso y Mónica",
      title: "Bachata paso a paso",
      description:
        "La playlist completa para seguir aprendiendo, desde los primeros pasos hasta las figuras intermedias.",
      url: bachataPlaylistUrl,
      videos: bachataPlaylist,
    },
    en: {
      attribution: "Bachata Dance Academy (Demetrio & Nicole)",
      title: "Bachata, step by step",
      description:
        "Keep learning with this playlist of partnerwork combinations, from intermediate steps to class recaps.",
      url: "https://www.youtube.com/watch?v=9iL8C1zN2XM&list=PLOINrozVyRptLTdHJPT5Hf0kGp54IYMOC",
      videos: [
        [
          "9iL8C1zN2XM",
          "Intermediate Bachata Combination #1 - Demetrio & Nicole - Bachata Dance Academy",
          "intermediate",
        ],
        [
          "4fyoME2Y88I",
          "Intermediate Bachata Tutorial - Combination #2 - Demetrio & Nicole - Bachata Dance Academy",
          "intermediate",
        ],
        [
          "H5WJhYHj3tM",
          "Intermediate Bachata Combination #2 - Demetrio & Nicole | Bachata Dance Academy",
          "intermediate",
        ],
        [
          "7G63OlSQ9Pc",
          "Intermediate Bachata Combination - Class Recap #19 - Demetrio & Nicole - Bachata Dance Academy",
          "intermediate",
        ],
      ],
    },
  },
  salsa: {
    es: {
      attribution: "Alfonso y Mónica",
      title: "Salsa paso a paso",
      description:
        "Aprende salsa con la playlist completa, desde los pasos básicos hasta las figuras y técnicas intermedias.",
      url: "https://www.youtube.com/watch?v=IbBBYxbtz-w&list=PL2hC4eLPfJuNZA764hKiHgrEzfwjB1oQ4",
      videos: [
        ["IbBBYxbtz-w", "1. Pasos Básicos de Salsa | Aprende a bailar salsa con Alfonso y Mónica | Clases de salsa", "initial"],
        ["dqOLfTcKzzs", "2. Cross Body | Pasos Básicos de Salsa | Aprende a bailar salsa con Alfonso y Mónica", "initial"],
        ["s1sPRjGh5KU", "3. Giro a la Derecha | Pasos Básicos de Salsa | Aprende a bailar salsa con Alfonso y Mónica", "initial"],
        ["TmXNlEjzojM", "4. Figura Básica de Salsa | Pasos Básicos de Salsa | Aprende a bailar salsa con Alfonso y Mónica", "foundations"],
        ["X7FMm7UU2fE", "5. Giro a la Izquierda | Pasos básicos de Salsa | Alfonso y Mónica | Clases de Salsa", "foundations"],
        ["7WLLmHVsEWs", "7. Figura Titanic | Pasos Básicos de Salsa | Alfonso y Mónica", "foundations"],
        ["lNut3-Zvznc", "6. Figura SALSA en línea | Freno Hombro + Giro | Pasos básicos de Salsa | Alfonso y Mónica", "foundations"],
        ["t-nVaAYZaOo", "8. Figura Básica - Intermedia | Recopilación de pasos | Cómo bailar salsa | Alfonso y Mónica", "foundations"],
        ["aKh2Mv3_V6I", "9. Figura Salsa Candado | Pasos Básicos de Salsa | Alfonso y Mónica", "foundations"],
        ["VpZNe8sm5qI", "10. Titanic Complicado | Como bailar salsa | Alfonso y Mónica", "foundations"],
        ["nUtOXkeECTY", "12. Cross con Vuelta | Cómo Bailar Salsa | Alfonso y Mónica | Pasos básicos de SALSA", "foundations"],
        ["w_m_nRKVFSw", "11. Figura de Salsa | Candado + Titanic + Titanic Complicado | Alfonso y Mónica", "foundations"],
        ["c2qWOAC431Q", "13. Open con Giro | Pasos básicos de SALSA| Alfonso y Mónica | Clases de salsa", "foundations"],
        ["L_RLWl9ynJM", "14. FOOTWORK | PASOS LIBRES DE SALSA | Alfonso y Mónica | Cómo Bailar Salsa", "foundations"],
        ["adFyhZENBmM", "15. Giro Básico a la Derecha | Aprende a Bailar Salsa | Alfonso y Mónica | Clases de SALSA", "foundations"],
        ["BCRhbOgHTGY", "Salsa Footwork | Trabajo Individual | Alfonso y Mónica", "intermediate"],
        ["56Uwun6Kiks", "7 TIPS para BAILAR MEJOR en pareja en CUALQUIER ESTILO | Alfonso y Mónica", "intermediate"],
        ["wIVZRI61Hqs", "Suzie Q | Explicación y Tres variantes l Pasos Básicos de Salsa | Alfonso y Mónica", "foundations"],
        ["-_7QiZJaML8", "Cómo mover los brazos bailando | Salsa | Alfonso y Mónica", "foundations"],
        ["StmQ0Gzc_q0", "5 Trucos para mejorar tu técnica de guía en SALSA | Alfonso y Mónica", "intermediate"],
        ["chwNbUupt0I", "Con este giro sorprenderás a tu pareja y mejorarán tus figuras de salsa | Alfonso y Mónica", "intermediate"],
        ["318rg8hNl5Y", "El Vídeo DEFINITIVO para APRENDER a BAILAR SALSA en pareja | Alfonso y Mónica", "initial"],
        ["sMXXL5IzLLU", "Cómo hacer el Doble Giro en Salsa | Cómo Bailar Salsa | Alfonso y Mónica | Pasos básicos de SALSA", "foundations"],
      ],
    },
    en: {
      attribution: "Bachata Dance Academy (Demetrio & Nicole)",
      title: "Salsa, step by step",
      description:
        "Learn salsa with these beginner lessons, partnerwork fundamentals, and an intermediate tutorial.",
      url: "https://www.youtube.com/watch?v=jpIJMKjxkQ0&list=PLOINrozVyRpuCYM3BwbQtdgTAe9U8NRXc",
      videos: [
        ["jpIJMKjxkQ0", "Salsa Dancing Beginner Basics Tutorial Video", "initial"],
        ["QlD7qDJVToU", "The Best Online Beginner Salsa Course | Preview", "initial"],
        ["M0-VyUTij6Y", "Salsa Basic Step Fundamentals With Partner - Frame Explanation - Demetrio & Nicole", "initial"],
        ["zYro7vnttY8", "Complete Beginner Salsa Tutorial - Learn Salsa Dancing With A Partner - Demetrio & Nicole", "initial"],
        ["PHgi4Vx-WVg", "Beginner Salsa Tutorial - Learn How To Salsa Dance With A Partner - Demetrio & Nicole", "initial"],
        ["C_8NyVTazZA", "Intermediate Salsa Tutorial - Learn How To Salsa Dance With A Partner - Demetrio & Nicole", "intermediate"],
        ["0By6VuRC1qI", "Salsa Dancing Basics Tutorial - Beginner Cross Body Lead - Demetrio & Nicole", "foundations"],
        ["NwiHUn_fnHI", "Learn How To Dance Salsa - Beginner Salsa - Online Course - Demetrio & Nicole", "initial"],
        ["Cy3t7ZtEfr4", "Introducing: The 90 Day Beginner Salsa Dancing Challenge Online", "initial"],
        ["up6NwQmGOGc", "Salsa Workout / Warmup - Footwork & Turns (Fast) Follow Along Video - Do This Everyday", "foundations"],
      ],
    },
  },
};
