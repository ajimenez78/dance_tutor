export type Language = "es" | "en";
export type Style = "salsa" | "bachata";
export type PlaylistLevel = "initial" | "foundations" | "intermediate";

export type Tutorial = {
  youtubeId: string;
  author: string;
  source: string;
  audioLanguage: Language;
};

export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  learn: string;
  steps: string[];
  tip: string;
  question: string;
  answers: string[];
  correct: number;
  playlistLevel?: PlaylistLevel;
  tutorial?: Tutorial;
};

export type StyleInfo = {
  name: string;
  feel: string;
  description: string;
  timing: string;
  source: string;
};
