import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { useLanguage } from "./i18n";
import type { Lesson } from "./lessons";
import { tutorials } from "./videos";
import type { Tutorial } from "./videos";

export default function VideoTutorial({ lesson }: { lesson: Lesson }) {
  const { language } = useLanguage();
  const video = tutorials[lesson.id][language];
  return (
    <TutorialPlayer
      key={`${lesson.id}-${video.youtubeId}`}
      lesson={lesson}
      video={video}
    />
  );
}

function TutorialPlayer({
  lesson,
  video,
}: {
  lesson: Lesson;
  video: Tutorial;
}) {
  const { t, language } = useLanguage();
  const [playing, setPlaying] = useState(false);
  return (
    <section
      className="video-tutorial"
      aria-label={t("Video tutorial: {title}", { title: lesson.title })}
    >
      <div className="video-frame">
        {playing ? (
          <iframe
            title={t("Video tutorial: {title}", { title: lesson.title })}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&hl=${language}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button className="video-preview" onClick={() => setPlaying(true)}>
            <span className="video-play">
              <Play size={30} />
            </span>
            <span>{t("Watch the tutorial")}</span>
            <span className="video-preview-focus">{lesson.title}</span>
          </button>
        )}
      </div>
      <div className="video-details">
        <div>
          <span className="eyebrow">{t("VIDEO TUTORIAL")}</span>
          <p>{video.author}</p>
        </div>
        <a
          className="text-button"
          href={video.source}
          target="_blank"
          rel="noreferrer"
        >
          {t("Watch on the original site")}
          <ExternalLink size={14} />
          <span className="sr-only">{t(" (opens in a new tab)")}</span>
        </a>
      </div>
      <p className="video-language">
        {t(video.audioLanguage === "es" ? "Spanish audio" : "English audio")}
      </p>
      <p className="video-note">
        {t(
          "Focus on this lesson’s steps. You can pause and replay the demonstration.",
        )}
        {playing && (
          <>
            {" "}
            {t(
              "If the player is unavailable, watch the tutorial on the original site.",
            )}
          </>
        )}
      </p>
    </section>
  );
}
