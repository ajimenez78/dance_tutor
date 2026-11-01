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
        ["IbBBYxbtz-w", "1. Basic Salsa Steps | Learn to dance salsa with Alfonso and Mónica | Salsa classes", "initial"],
        ["dqOLfTcKzzs", "2. Cross Body | Basic Salsa Steps | Learn to dance salsa with Alfonso and Monica", "initial"],
        ["s1sPRjGh5KU", "3. Right Turn | Basic Salsa Steps | Learn to dance salsa with Alfonso and Monica", "initial"],
        ["TmXNlEjzojM", "4. Figura Básica de Salsa | Pasos Básicos de Salsa | Aprende a bailar salsa con Alfonso y Mónica", "foundations"],
        ["X7FMm7UU2fE", "5. Left Turn | Basic Salsa Steps | Alfonso and Monica | Salsa Classes", "foundations"],
        ["7WLLmHVsEWs", "7. Figure Titanic | Basic Gravy Steps | Alfonso and Monica", "foundations"],
        ["lNut3-Zvznc", "6. Inline Salsa Figure | Shoulder Brake + Turn | Basic Salsa Steps | Alfonso and Monica", "foundations"],
        ["t-nVaAYZaOo", "8. Basic Figure - Intermediate | Step Collection | How to Dance Salsa | Alfonso and Monica", "foundations"],
        ["aKh2Mv3_V6I", "9. Salsa Lock Figure | Basic Salsa Steps | Alfonso and Monica", "foundations"],
        ["VpZNe8sm5qI", "10. Complicated Titanic | How to Dance Salsa | Alfonso and Monica", "foundations"],
        ["nUtOXkeECTY", "12. Cross with Turn | How to Dance Salsa | Alfonso and Monica | Basic Salsa Steps", "foundations"],
        ["w_m_nRKVFSw", "11. Salsa Figure | Padlock + Titanic + Complicated Titanic | Alfonso and Monica", "foundations"],
        ["c2qWOAC431Q", "13. Open with Turn | Basic SALSA Steps | Alfonso & Mónica | Salsa Classes", "foundations"],
        ["L_RLWl9ynJM", "14. FOOTWORK | SALSA SHINES | Alfonso & Mónica | How to Dance Salsa", "foundations"],
        ["adFyhZENBmM", "15. Basic Right Turn | Learn to Dance Salsa | Alfonso and Monica | SALSA Classes", "foundations"],
        ["BCRhbOgHTGY", "Salsa Footwork | Individual Work | Alfonso and Monica", "intermediate"],
        ["56Uwun6Kiks", "7 TIPS for DANCING BETTER as a couple in ANY STYLE | Alfonso and Mónica", "intermediate"],
        ["wIVZRI61Hqs", "Suzie Q | Explanation and Three Variations | Basic Salsa Steps | Alfonso and Monica", "foundations"],
        ["-_7QiZJaML8", "How to move your arms while dancing | Salsa | Alfonso and Monica", "foundations"],
        ["StmQ0Gzc_q0", "5 Tips to Improve Your Salsa Guiding Technique | Alfonso and Monica", "intermediate"],
        ["chwNbUupt0I", "Surprise your partner and improve your salsa moves with this turn | Alfonso and Mónica", "intermediate"],
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
