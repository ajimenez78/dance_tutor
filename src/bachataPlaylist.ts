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
  ["hMuMCmtoVyw", "Pasos básicos de BACHATA | Como bailar BACHATA en pareja | Aprende a bailar BACHATA desde 0", "initial"],
  ["7ghxTuDN9vM", "GIROS de BACHATA | Como GIRAR en PAREJA | Aprende a Bailar Bachata en Pareja | Alfonso y Mónica", "foundations"],
  ["_Z5X00eTp98", "DOBLE TIEMPO y ONDA en BACHATA | Como Bailar Bachata en pareja | Alfonso y Mónica", "foundations"],
  ["DcgSb1aYUO0", "1. Pasos básicos de BACHATA | Como bailar bachata en pareja | Aprende a bailar con Alfonso y Mónica", "initial"],
  ["YWqZceskkOQ", "1. El Vídeo DEFINITIVO para BAILAR BACHATA en PAREJA | Pasos básicos de BACHATA con Alfonso y Mónica", "initial"],
  ["dt7g4QopoI0", "El VÍDEO DEFINITIVO para APRENDER a MOVER las CADERAS en BACHATA | Todos los TIPS | Alfonso y Mónica", "initial"],
  ["joL4SJ6BqvE", "1.1 Como MOVER la CADERA en BACHATA | Tips para BAILAR BACHATA |  Alfonso y Mónica", "initial"],
  ["nyd0LUzPJyI", "1.2 Aprende a MOVER la CADERA en BACHATA #2 | LADY STYLE | By Mónica Martinez | Alfonso Y Mónica", "initial"],
  ["uxIT_xx4kB0", "1.3 Cómo Mover las Caderas #3 | Pasitos Libres BACHATA | Alfonso y Mónica", "initial"],
  ["g8iM3HLCmAk", "1.4 Adornos y técnica para el Paso Básico de BACHATA | Alfonso y Mónica | Como bailar bachata", "initial"],
  ["-SH5RlTMAE0", "1.5 Movimientos de CADERA en el BÁSICO de la BACHATA | Cómo bailar bachata |  Alfonso y Mónica", "initial"],
  ["U93AuGCN6xU", "2. Pasos básicos de BACHATA #2 | Cómo bailar bachata | Aprende a bailar con Alfonso y Mónica", "initial"],
  ["ljoK3QQBmiA", "3. Pasos básicos de BACHATA #3 | Como bailar bachata | Aprende a bailar con Alfonso y Mónica", "initial"],
  ["BTFFqNhVmP0", "4. Giros | Figuras básicas de BACHATA | Como bailar Bachata | Aprende a bailar con Alfonso y Mónica", "foundations"],
  ["FbJDwf9v_zA", "5. Doble tiempo y Ondas | Como bailar bachata en pareja | Aprende a bailar con Alfonso y Mónica", "foundations"],
  ["aiTjxNUbWHU", "8. Cambio de base con 1/2 Giro | Como bailar bachata | Aprende bachata con Alfonso y Mónica", "foundations"],
  ["gCjmFleSoG4", "7. Cambio de base | Como bailar bachata en pareja | Aprende a bailar bachata con Alfonso y Mónica", "foundations"],
  ["B5dlkSpxfN0", "6. Paséala o paseo de la chica | Cómo bailar bachata en pareja | Alfonso y Mónica", "foundations"],
  ["d9fzYTMKU6w", "9. Figura básica de BACHATA | Como bailar en pareja | Aprende a bailar con Alfonso y Mónica", "foundations"],
  ["onF-29DDahU", "10. Figura Bachata #2 | Cambio de Base - Giro - Onda | Como bailar bachata | Bachata romantica", "foundations"],
  ["mNun53Bs_fc", "11. Medio (1/2) Giro en Pareja | Como bailar bachata | Aprende bachata con Alfonso y Mónica", "foundations"],
  ["yNFwE4KG4Ms", "12. Figura Bachata #3  | Como bailar bachata en Pareja | Bachata baile sensual | Bachata romantica", "foundations"],
  ["P0TgB_sTnyk", "13. Figura Básica #4 | Como BAILAR BACHATA en pareja | Alfonso y Mónica", "foundations"],
  ["kUU_q3If3Xs", "14. Figura Básica #5 | Alfonso y Mónica | Como BAILAR BACHATA en pareja", "foundations"],
  ["kclh2b87vnk", "15. Figura Intermedia de BACHATA #1 | Como bailar bachata | Aprende a bailar con Alfonso y Mónica", "intermediate"],
  ["mmtXXZEznQk", "16. Figura Bachata Intermedia #2 | Tutorial para social | Pasos de bachata explicados | Ep.1", "intermediate"],
  ["8WHdfLfLLeo", "18. Figura de BACHATA Intermedia #4 | Cómo Bailar Bachata | Alfonso y Mónica | Pasos de bachata", "intermediate"],
  ["NyDaF1egBbo", "17. Figura Intermedia de Bachata #3 | Cómo bailar Bachata | Pasos de bachata explicados | Ep.2", "intermediate"],
  ["cc3atXybnh8", "19. Figura de BACHATA Intermedia #5 | Cómo Bailar Bachata | Alfonso y Mónica | Pasos de bachata", "intermediate"],
  ["aDNFre6StsE", "20. Figura de BACHATA Intermedia #6 | Cómo Bailar Bachata | Alfonso y Mónica | Pasos de bachata", "intermediate"],
  ["IUlsiXjPw5U", "Explicación de la FIGURA de BACHATA Imitadora - Romeo Santos | Alfonso y Mónica", "intermediate"],
  ["FEotMkUJFCo", "BACHATA LADY STYLE by Mónica Martinez | Cómo bailar bachata", "intermediate"],
  ["10jS4LCHO0Q", "TIPS para bailar MEJOR | BACHATA | Alfonso y Mónica | Como bailar Bachata", "intermediate"],
  ["hlGJBiq9RTg", "10 Reglas del buen Bailador | Cómo bailar Bachata y Salsa | Alfonso y Mónica", "intermediate"],
  ["nIRQjfeAssw", "Paso a paso FIGURA de BACHATA #2 Imitadora - Romeo Santos | Alfonso y Mónica", "intermediate"],
  ["no05EnEKW4A", "6 Pasos básicos de BACHATA | Como bailar bachata en pareja | Aprende a bailar con Alfonso y Mónica", "intermediate"],
  ["fZpcuo659ek", "TIPS para volver al básico después del cambio de base | Cómo Bailar Bachata | Alfonso y Mónica", "intermediate"],
  ["gWUXTTrpiHw", "3 Salidas básicas para el Giro con las dos manos | Cómo bailar bachata en pareja | Alfonso y Mónica", "intermediate"],
  ["OGZVR41hOTA", "Cómo CAMINAR (y BAILAR) en TACONES | Aprender a caminar con TACONES | Alfonso y Mónica", "intermediate"],
  ["9Toz4_oquSM", "6 TIPS para BAILARINES PRINCIPIANTES | BACHATA y SALSA | Alfonso y Mónica", "intermediate"],
  ["hMFy4k8W8qU", "Cómo ser más SENSUAL al bailar BACHATA con estos 3 movimientos | Alfonso y Mónica", "intermediate"],
  ["fPEbxVWSBek", "Jugando con los Pasos Básicos de Bachata | Alfonso y Mónica", "intermediate"],
  ["13aDRLgRDwE", "Bachata footwork | Trabajo Individual | Alfonso y Mónica", "intermediate"],
  ["LOnvq3fPbLc", "Bachata Footwork - Explicación Pasos libres Blind Nights | Alfonso y Mónica", "intermediate"],
  ["6nSm-XqEmIY", "5 Trucos para Bailar BACHATA en Pareja | Conexión en pareja | Alfonso y Mónica", "intermediate"],
  ["gYnplmf0_MM", "3 ERRORES❌ que cometes al bailar BACHATA | ✅Trucos para solucionarlos | Alfonso y Mónica", "intermediate"],
  ["D3FPJ-xi928", "CÓMO hacer la ONDA en BACHATA | El vídeo DEFINITIVO | Alfonso y Mónica", "intermediate"],
  ["FfPHFI7jrlY", "3 TÉCNICAS 🔐 para MEJORAR la CONDUCCIÓN 🚀 BACHATA FOLLOWER TIPS 🚀Alfonso y Mónica", "intermediate"],
  ["n8u0qS3DiHo", "4 GIROS 💫 que NECESITAS para BAILAR BACHATA | Alfonso y Mónica", "intermediate"],
  ["Cicfze-f_Mc", "Aprende el 'Rompe' en Bachata + 3 Variantes para Impresionar 🌟 con Alfonso y Mónica", "intermediate"],
  ["VnDl1LFJy-Q", "Dudas al apuntarse a clases de baile | Alfonso y Mónica", "intermediate"],
  ["L6p_9EzuBpw", "3 Salidas para el PUENTE de BACHATA | Alfonso y Mónica", "intermediate"],
  ["CsCFwjxFuqw", "Figura de BACHATA Básica con los RECURSOS explicados en los vídeos 1-3 | Alfonso y Mónica", "intermediate"],
  ["70dNF8MX10c", "3 Variaciones del Paso Básico de BACHATA | Alfonso y Mónica", "intermediate"],
];

export function playlistVideoUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
