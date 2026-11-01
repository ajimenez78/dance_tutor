import { describe, expect, it } from "vitest";
import {
  playlistLevels,
  playlists,
} from "./playlists";
import { playlistVideoUrl } from "./bachataPlaylist";

const expectedPlaylists = [
  {
    style: "bachata",
    language: "es",
    url: "https://www.youtube.com/playlist?list=PL2hC4eLPfJuMsjVBE8qFywgchnsRKB2vB",
    count: 54,
    levels: { initial: 11, foundations: 13, intermediate: 30 },
  },
  {
    style: "bachata",
    language: "en",
    url: "https://www.youtube.com/watch?v=9iL8C1zN2XM&list=PLOINrozVyRptLTdHJPT5Hf0kGp54IYMOC",
    count: 4,
    levels: { initial: 0, foundations: 0, intermediate: 4 },
  },
  {
    style: "salsa",
    language: "es",
    url: "https://www.youtube.com/watch?v=IbBBYxbtz-w&list=PL2hC4eLPfJuNZA764hKiHgrEzfwjB1oQ4",
    count: 23,
    levels: { initial: 4, foundations: 15, intermediate: 4 },
  },
  {
    style: "salsa",
    language: "en",
    url: "https://www.youtube.com/watch?v=jpIJMKjxkQ0&list=PLOINrozVyRpuCYM3BwbQtdgTAe9U8NRXc",
    count: 10,
    levels: { initial: 7, foundations: 2, intermediate: 1 },
  },
] as const;

describe("learning playlists", () => {
  it.each(expectedPlaylists)(
    "$language $style playlist has complete, uniquely classified metadata",
    ({ style, language, url, count, levels }) => {
      const playlist = playlists[style][language];
      const ids = playlist.videos.map(([id]) => id);
      const levelCounts = Object.fromEntries(
        playlistLevels.map((level) => [
          level,
          playlist.videos.filter((video) => video[2] === level).length,
        ]),
      );

      expect(playlist.url).toBe(url);
      expect(playlist.videos).toHaveLength(count);
      expect(new Set(ids).size).toBe(count);
      expect(ids.every((id) => /^[A-Za-z0-9_-]{11}$/.test(id))).toBe(true);
      expect(playlist.videos.every(([, title]) => title.trim().length > 0)).toBe(
        true,
      );
      expect(levelCounts).toEqual(levels);
      expect(playlistVideoUrl(ids[0])).toBe(
        `https://www.youtube.com/watch?v=${ids[0]}`,
      );
    },
  );
});
