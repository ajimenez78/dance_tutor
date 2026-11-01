export type BachataPlaylistLevel = "initial" | "foundations" | "intermediate";

export type BachataPlaylistVideo = readonly [
  id: string,
  title: string,
  level: BachataPlaylistLevel,
];

export const bachataPlaylistUrl =
  "https://www.youtube.com/playlist?list=PL2hC4eLPfJuMsjVBE8qFywgchnsRKB2vB";

// Curated from the complete Alfonso y Mónica Bachata playlist. The levels are
// ordered from first steps to figures and then social/intermediate material.
export const bachataPlaylist: BachataPlaylistVideo[] = [
  ["hMuMCmtoVyw", "Bachata for Beginners: Basic Steps & How to Dance with a Partner", "initial"],
  ["7ghxTuDN9vM", "BACHATA SPINS | How to SPIN as a Couple | Learn to Dance Bachata as a Couple | Alfonso and Monica", "foundations"],
  ["_Z5X00eTp98", "Double Time and Wave in Bachata | How to Dance Bachata as a Couple | Alfonso and Monica", "foundations"],
  ["DcgSb1aYUO0", "1. Basic Bachata Steps | How to Dance Bachata as a Couple | Learn to Dance with Alfonso and Monica", "initial"],
  ["YWqZceskkOQ", "1. El Vídeo DEFINITIVO para BAILAR BACHATA en PAREJA | Pasos básicos de BACHATA con Alfonso y Mónica", "initial"],
  ["dt7g4QopoI0", "The ULTIMATE VIDEO to LEARN how to MOVE your HIPS in BACHATA | All the TIPS | Alfonso and Mónica", "initial"],
  ["joL4SJ6BqvE", "1.1 How to Move Your Hips in Bachata | Tips for Dancing Bachata | Alfonso and Monica", "initial"],
  ["nyd0LUzPJyI", "1.2 Learn to Move Your Hips in Bachata #2 | Lady Style | By Monica Martinez | Alfonso and Monica", "initial"],
  ["uxIT_xx4kB0", "1.3 How to Move Your Hips #3 | Free Steps Bachata | Alfonso and Monica", "initial"],
  ["g8iM3HLCmAk", "1.4 Adornos y técnica para el Paso Básico de BACHATA | Alfonso y Mónica | Como bailar bachata", "initial"],
  ["-SH5RlTMAE0", "3 Hip Movements in the BACHATA BASIC Step | How to dance bachata | Alfonso & Mónica", "initial"],
  ["U93AuGCN6xU", "2. Pasos básicos de BACHATA #2 | Cómo bailar bachata | Aprende a bailar con Alfonso y Mónica", "initial"],
  ["ljoK3QQBmiA", "3. Basic Bachata Steps #3 | How to Dance Bachata | Learn to Dance with Alfonso and Monica", "initial"],
  ["BTFFqNhVmP0", "4. Turns | Basic Bachata Figures | How to Dance Bachata | Learn to Dance with Alfonso and Monica", "foundations"],
  ["FbJDwf9v_zA", "5. Doble Tiempo and Ondas | How to Dance Bachata as a Couple | Learn to Dance with Alfonso and Mó...", "foundations"],
  ["aiTjxNUbWHU", "8. Cambio de base con 1/2 Giro | Como bailar bachata | Aprende bachata con Alfonso y Mónica", "foundations"],
  ["gCjmFleSoG4", "7. Cambio de base | Como bailar bachata en pareja | Aprende a bailar bachata con Alfonso y Mónica", "foundations"],
  ["B5dlkSpxfN0", "6. Paséala or The Girl's Walk | How to dance bachata as a couple | Alfonso and Mónica", "foundations"],
  ["d9fzYTMKU6w", "9. Basic Bachata Figure | How to Dance as a Couple | Learn to Dance with Alfonso and Monica", "foundations"],
  ["onF-29DDahU", "10. Bachata Figure #2 | Base Change - Turn - Wave | How to Dance Bachata | Romantic Bachata", "foundations"],
  ["mNun53Bs_fc", "11. Half (1/2) Couples Twist | How to Dance Bachata | Learn Bachata with Alfonso and Monica", "foundations"],
  ["yNFwE4KG4Ms", "12. Bachata Move #3 | How to dance bachata as a couple | Sensual bachata dance | Romantic bachata", "foundations"],
  ["P0TgB_sTnyk", "13. Basic Figure #4 | How to Dance Bachata as a Couple | Alfonso and Monica", "foundations"],
  ["kUU_q3If3Xs", "14. Figura Básica #5 | Alfonso y Mónica | Como BAILAR BACHATA en pareja", "foundations"],
  ["kclh2b87vnk", "15. Intermediate Bachata Figure #1 | How to Dance Bachata | Learn to Dance with Alfonso and Monica", "intermediate"],
  ["mmtXXZEznQk", "Bachata | Tutorial for social | Bachata Steps Explained | Ep.1", "intermediate"],
  ["8WHdfLfLLeo", "18. Intermediate BACHATA Figure #4 | How to Dance Bachata | Alfonso and Monica | Bachata Steps", "intermediate"],
  ["NyDaF1egBbo", "17. Intermediate Bachata Figure #3 | How to dance Bachata | Bachata steps explained | Ep.2", "intermediate"],
  ["cc3atXybnh8", "19. Intermediate Bachata Figure #5 | How to Dance Bachata | Alfonso and Monica | Bachata Steps", "intermediate"],
  ["aDNFre6StsE", "20. Intermediate BACHATA Figure #6 | How to Dance Bachata | Alfonso and Mónica | Bachata steps", "intermediate"],
  ["IUlsiXjPw5U", "Explicación de la FIGURA de BACHATA Imitadora - Romeo Santos | Alfonso y Mónica", "intermediate"],
  ["FEotMkUJFCo", "BACHATA LADY STYLE by Mónica Martinez | How to dance bachata", "intermediate"],
  ["10jS4LCHO0Q", "TIPS para bailar MEJOR | BACHATA | Alfonso y Mónica | Como bailar Bachata", "intermediate"],
  ["hlGJBiq9RTg", "10 Golden Rules for Every Dancer | How to Dance Bachata and Salsa | Alfonso y Mónica", "intermediate"],
  ["nIRQjfeAssw", "BACHATA FIGURE Step-by-Step #2 Imitadora - Romeo Santos | Alfonso y Mónica", "intermediate"],
  ["no05EnEKW4A", "6 Basic BACHATA steps | How to dance bachata as a couple | Learn to dance with Alfonso and Mónica", "intermediate"],
  ["fZpcuo659ek", "TIPS para volver al básico después del cambio de base | Cómo Bailar Bachata | Alfonso y Mónica", "intermediate"],
  ["gWUXTTrpiHw", "3 Basic Two-Handed Turn-Outs | How to Dance Bachata as a Couple | Alfonso and Monica", "intermediate"],
  ["OGZVR41hOTA", "How to Walk (and Dance) in Heels | Learning to Walk in Heels | Alfonso and Monica", "intermediate"],
  ["9Toz4_oquSM", "6 TIPS for BEGINNING DANCERS | BACHATA and SALSA | Alfonso and Mónica", "intermediate"],
  ["hMFy4k8W8qU", "How to be more SENSUAL when dancing BACHATA with these 3 moves | Alfonso & Mónica", "intermediate"],
  ["fPEbxVWSBek", "Playing with Basic Bachata Steps | Alfonso and Mónica", "intermediate"],
  ["13aDRLgRDwE", "Bachata Footwork | Solo Dancing | Alfonso and Mónica", "intermediate"],
  ["LOnvq3fPbLc", "Bachata Footwork - Explicación Pasos libres Blind Nights | Alfonso y Mónica", "intermediate"],
  ["6nSm-XqEmIY", "5 Tips to Dance BACHATA as a Couple | Couple Connection | Alfonso and Mónica", "intermediate"],
  ["gYnplmf0_MM", "3 MISTAKES You Make When Dancing BACHATA | Tricks to Fix Them | Alfonso and Mónica", "intermediate"],
  ["D3FPJ-xi928", "CÓMO hacer la ONDA en BACHATA | El vídeo DEFINITIVO | Alfonso y Mónica", "intermediate"],
  ["FfPHFI7jrlY", "3 TÉCNICAS para MEJORAR la CONDUCCIÓN BACHATA FOLLOWER TIPS | Alfonso y Mónica", "intermediate"],
  ["n8u0qS3DiHo", "4 TURNS You NEED to DANCE BACHATA | Alfonso and Monica", "intermediate"],
  ["Cicfze-f_Mc", "Learn the 'Rompe' in Bachata + 3 Variations to Impress with Alfonso and Mónica", "intermediate"],
  ["VnDl1LFJy-Q", "Common Fears About Starting Dance Classes | Alfonso & Mónica", "intermediate"],
  ["L6p_9EzuBpw", "3 Bachata Bridge Excursions | Alfonso and Monica", "intermediate"],
  ["CsCFwjxFuqw", "Figura de BACHATA Básica con los RECURSOS explicados en los vídeos 1-3 | Alfonso y Mónica", "intermediate"],
  ["70dNF8MX10c", "3 BACHATA Basic Step Variations | Alfonso & Mónica", "intermediate"],
];

export function playlistVideoUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
