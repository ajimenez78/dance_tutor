import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  AudioLines,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  Flame,
  Footprints,
  Leaf,
  Library,
  MoveUpRight,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LanguagePicker, LanguageProvider, useLanguage } from "./i18n";
import { useContent } from "./content";
import VideoTutorial from "./VideoTutorial";
import type { Lesson, Style } from "./lessons";
import {
  completeLesson,
  dateKey,
  loadProgress,
  nextLesson,
  normalizeUrl,
  previousDay,
  sourceKind,
  STORAGE_KEY,
  streak,
  stageStart,
} from "./model";
import type { Progress, Source, StartingStage } from "./model";
import Practice from "./Practice";

type Tab = "Today" | "Learning path" | "My library";
const tabs: { name: Tab; icon: LucideIcon }[] = [
  { name: "Today", icon: Leaf },
  { name: "Learning path", icon: Footprints },
  { name: "My library", icon: Library },
];

function RhythmArt({
  style,
  compact = false,
}: {
  style: Style;
  compact?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <div
      className={`rhythm-art ${style} ${compact ? "compact" : ""}`}
      aria-hidden="true"
    >
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="orbit orbit-three" />
      <div className="art-foot foot-one">
        <Footprints strokeWidth={1.2} />
      </div>
      <div className="art-foot foot-two">
        <Footprints strokeWidth={1.2} />
      </div>
      <div className="art-note note-one">
        {style === "salsa" ? "1" : t("step")}
      </div>
      <div className="art-note note-two">
        {style === "salsa" ? "2" : t("step")}
      </div>
      <div className="art-note note-three">
        {style === "salsa" ? "3" : t("tap")}
      </div>
      <span className="art-caption">
        {style === "salsa"
          ? t("A LITTLE SPARK IN EVERY STEP")
          : t("MAKE ROOM FOR A LITTLE FLOW")}
      </span>
      <span className="art-star">
        <Sparkles size={25} strokeWidth={1.2} />
      </span>
    </div>
  );
}

function Brand() {
  return (
    <span className="brand">
      <AudioLines size={29} strokeWidth={1.8} />
      ritmo<span className="brand-period">.</span>
    </span>
  );
}

function StagePicker({
  value,
  onChange,
}: {
  value: StartingStage;
  onChange: (stage: StartingStage) => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="stage-picker">
      <label htmlFor="starting-stage">{t("Starting point")}</label>
      <select
        id="starting-stage"
        value={value}
        onChange={(event) => onChange(event.target.value as StartingStage)}
      >
        <option value="rhythm">{t("Start with rhythm")}</option>
        <option value="basics">{t("I know the rhythm")}</option>
        <option value="flow">{t("I know the basic steps")}</option>
      </select>
      <p>
        <strong>
          {t(
            { rhythm: "Rhythm", basics: "Basic steps", flow: "Combinations" }[
              value
            ],
          )}
        </strong>
        {" — "}
        {t(
          "Earlier lessons stay available for review. Only finished lessons count as completed.",
        )}
      </p>
    </div>
  );
}

function Onboarding({
  onSelect,
}: {
  onSelect: (style: Style, stage: StartingStage) => void;
}) {
  const { t } = useLanguage();
  const { styles } = useContent();
  const [startingStage, setStartingStage] = useState<StartingStage>("rhythm");
  return (
    <div className="onboarding">
      <header className="onboarding-header">
        <Brand />
        <LanguagePicker />
      </header>
      <main className="onboarding-main">
        <span className="eyebrow">
          <span className="tiny-dot" />
          {t("YOUR DAILY DANCE PRACTICE")}
        </span>
        <h1>
          {t("Find your rhythm.")}
          <br />
          <em>{t("One step at a time.")}</em>
        </h1>
        <p className="intro">
          {t("You don’t need a partner or a perfect sense of rhythm.")}
          <br className="desktop-break" />
          {" "}
          {t("Just a few minutes, a little curiosity, and a place to start.")}
        </p>
        <div className="choose-label">
          <span>{t("What moves you?")}</span>
          <span className="small muted">
            {t("Choose your first style")}
            <ArrowDown size={14} />
          </span>
        </div>
        <StagePicker value={startingStage} onChange={setStartingStage} />
        <div className="style-cards">
          {(["salsa", "bachata"] as const).map((style) => (
            <button
              key={style}
              className={`style-card ${style}`}
              onClick={() => onSelect(style, startingStage)}
              aria-label={t("Start with {style}", {
                style: styles[style].name,
              })}
            >
              <RhythmArt style={style} />
              <div className="style-card-copy">
                <div>
                  <span className="eyebrow">{t("BEGINNER FRIENDLY")}</span>
                  <h2>{styles[style].name}</h2>
                  <p>{styles[style].feel}</p>
                </div>
                <span className="round-arrow">
                  <ArrowRight size={23} />
                </span>
              </div>
            </button>
          ))}
        </div>
        <div className="onboarding-notes">
          <span>
            <Clock3 size={15} />
            {t("A few minutes a day")}
          </span>
          <span>
            <Footprints size={15} />
            {t("Small, guided steps")}
          </span>
          <span>
            <Leaf size={15} />
            {t("Your pace, always")}
          </span>
        </div>
      </main>
      <footer className="onboarding-footer">
        {t("A little less scrolling. A little more dancing.")}
        <span>
          {t("No account needed. Your progress stays in this browser.")}
        </span>
      </footer>
    </div>
  );
}

function Week({ activity }: { activity: string[] }) {
  const { t, language } = useLanguage();
  const days: Date[] = [];
  let cursor = new Date();
  for (let i = 0; i < 7; i++) {
    days.unshift(cursor);
    cursor = previousDay(cursor);
  }
  return (
    <div className="week">
      {days.map((date, i) => {
        const done = activity.includes(dateKey(date));
        return (
          <div className="week-day" key={dateKey(date)}>
            <span>
              {date.toLocaleDateString(language, { weekday: "narrow" })}
            </span>
            <span
              role="img"
              className={`day-dot ${done ? "done" : ""} ${i === 6 ? "today" : ""}`}
              aria-label={`${date.toLocaleDateString(language, { month: "short", day: "numeric" })}: ${done ? t("practiced") : t("not practiced")}${i === 6 ? ", " + t("today") : ""}`}
            >
              {done ? <Check size={15} /> : i === 6 ? <span /> : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function LessonList({
  style,
  completed,
  onOpen,
  short = false,
  startingStage = "rhythm",
}: {
  style: Style;
  completed: string[];
  onOpen: (lesson: Lesson) => void;
  short?: boolean;
  startingStage?: StartingStage;
}) {
  const { t } = useLanguage();
  const { lessons } = useContent();
  const next = nextLesson(style, completed, startingStage);
  const visible = short
    ? lessons[style].slice(
        stageStart[startingStage],
        stageStart[startingStage] + 3,
      )
    : lessons[style];
  return (
    <div className="lesson-list">
      {visible.map((lesson) => (
        <button
          key={lesson.id}
          className={`lesson-row ${next.id === lesson.id && !completed.includes(lesson.id) ? "next" : ""}`}
          onClick={() => onOpen(lesson)}
        >
          <span
            className={`lesson-number ${completed.includes(lesson.id) ? "finished" : ""}`}
          >
            {completed.includes(lesson.id) ? (
              <Check size={18} />
            ) : (
              String(lessons[style].indexOf(lesson) + 1).padStart(2, "0")
            )}
          </span>
          <span className="lesson-row-text">
            <strong>{lesson.title}</strong>
            <span>
              {lesson.tag}
              <span className="separator">·</span>5 min
              {completed.includes(lesson.id) && (
                <span className="completed-label">{t("Completed")}</span>
              )}
              {!completed.includes(lesson.id) &&
                lessons[style].indexOf(lesson) < stageStart[startingStage] && (
                  <span className="completed-label">
                    {t("Optional review")}
                  </span>
                )}
            </span>
          </span>
          <ArrowRight size={18} />
        </button>
      ))}
    </div>
  );
}

function Today({
  style,
  progress,
  onOpen,
  onTab,
}: {
  style: Style;
  progress: Progress;
  onOpen: (lesson: Lesson) => void;
  onTab: (tab: Tab) => void;
}) {
  const { t, language } = useLanguage();
  const { lessons, styles } = useContent();
  const startingStage = progress.stages[style];
  const recommended = nextLesson(style, progress.completed, startingStage);
  const next = lessons[style].find((item) => item.id === recommended.id)!;
  const stageComplete = lessons[style]
    .slice(stageStart[startingStage])
    .every((item) => progress.completed.includes(item.id));
  const count = lessons[style].filter((lesson) =>
    progress.completed.includes(lesson.id),
  ).length;
  const practiced = progress.activity.includes(dateKey());
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("YOUR DAILY DOSE OF DANCE")}</span>
          <h1>
            {t("A little practice.")}
            <br className="mobile-break" />{" "}
            <em>{t("A lot of possibility.")}</em>
          </h1>
          <p>{t("Come as you are. Leave one step further.")}</p>
        </div>
        <span className="date-label">
          {new Date().toLocaleDateString(language, {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
      <div className="today-grid">
        <section className="daily-card">
          <div className="daily-copy">
            <span className="pill">
              <span />
              {practiced
                ? t("KEEP THE RHYTHM GOING")
                : t("TODAY’S LITTLE STEP")}
            </span>
            <span className="daily-meta">
              {t("{style} foundations", { style: styles[style].name })}
              <span> / </span>
              {t("Lesson {number}", {
                number: lessons[style].indexOf(next) + 1,
              })}
            </span>
            <h2>{count === 4 ? t("Back to the basics.") : next.title + "."}</h2>
            <p>
              {count === 4
                ? t(
                    "Your foundations are complete. Keep them feeling natural with a little daily practice.",
                  )
                : stageComplete
                  ? t(
                      "Your selected stage is complete. Repeat it or revisit earlier lessons in your path.",
                    )
                  : next.subtitle +
                    " " +
                    t("A few minutes now can change the way you move.")}
            </p>
            <button className="button cream" onClick={() => onOpen(next)}>
              {stageComplete ? t("Practice again") : t("Let’s practice")}
              <ArrowRight size={17} />
            </button>
            <span className="daily-footnote">
              <Clock3 size={14} />
              {t("About 5 minutes")}
              <span>·</span>
              {t("No partner needed")}
            </span>
          </div>
          <RhythmArt style={style} compact />
        </section>
        <section className="habit-card">
          <div className="card-topline">
            <span className="eyebrow">{t("SHOWING UP COUNTS")}</span>
            <Flame size={18} />
          </div>
          <div className="streak-number">
            {streak(progress.activity)}
            <span>
              {t(
                streak(progress.activity) === 1
                  ? "day in a row"
                  : "days in a row",
              )}
            </span>
          </div>
          <p>
            {practiced
              ? t(
                  "You made time for yourself today. That’s a step worth celebrating.",
                )
              : t(
                  "Big things start with a small daily habit. Let’s make today day {day}.",
                  { day: streak(progress.activity) + 1 },
                )}
          </p>
          <Week activity={progress.activity} />
          <div className={`habit-message ${practiced ? "practiced" : ""}`}>
            {practiced ? <Check size={15} /> : <span className="tiny-dot" />}
            {practiced
              ? t("Today’s practice, done.")
              : t("A fresh chance to find your rhythm.")}
          </div>
        </section>
      </div>
      <div className="below-grid">
        <section>
          <div className="section-heading">
            <div>
              <span className="eyebrow">{t("BUILD YOUR FOUNDATION")}</span>
              <h2>
                {t("Your {style} journey", {
                  style: styles[style].name.toLowerCase(),
                })}
              </h2>
            </div>
            <button
              className="text-button"
              onClick={() => onTab("Learning path")}
            >
              {t("View path")}
              <ArrowRight size={15} />
            </button>
          </div>
          <div className="path-card">
            <div className="path-summary">
              <span>{t("Little steps, real progress")}</span>
              <span>{t("{count} / 4 lessons", { count })}</span>
            </div>
            <div className="progress-track">
              <span style={{ width: `${count * 25}%` }} />
            </div>
            <LessonList
              style={style}
              completed={progress.completed}
              onOpen={onOpen}
              short
              startingStage={startingStage}
            />
          </div>
        </section>
        <section className="inspiration">
          <div className="inspiration-symbol">
            <Sparkles size={26} strokeWidth={1.3} />
          </div>
          <span className="eyebrow">{t("A GENTLE REMINDER")}</span>
          <blockquote>
            “{t("You don’t have to be good to begin. You just have to begin.")}”
          </blockquote>
          <p>
            {t("Some days, one song is enough.")}
            <br />
            {t("Make a little room for yourself.")}
          </p>
          <span className="inspiration-rule" />
          <button className="text-button" onClick={() => onTab("My library")}>
            {t("Collect a little inspiration")}
            <MoveUpRight size={15} />
          </button>
        </section>
      </div>
    </>
  );
}

function LearningPath({
  style,
  progress,
  onOpen,
  onStageChange,
}: {
  style: Style;
  progress: Progress;
  onOpen: (lesson: Lesson) => void;
  onStageChange: (stage: StartingStage) => void;
}) {
  const { t } = useLanguage();
  const { lessons, styles } = useContent();
  const count = lessons[style].filter((lesson) =>
    progress.completed.includes(lesson.id),
  ).length;
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {t("SMALL STEPS. SOLID FOUNDATIONS.")}
          </span>
          <h1>
            {t("Your {style} journey", {
              style: styles[style].name.toLowerCase(),
            })}
          </h1>
          <p>
            {t("One idea at a time. Revisit any lesson whenever you like.")}
          </p>
        </div>
      </div>
      <StagePicker value={progress.stages[style]} onChange={onStageChange} />
      <div className="path-page-grid">
        <section className="full-path path-card">
          <div className="path-header">
            <div>
              <span className="eyebrow">{t("CHAPTER 01")}</span>
              <h2>{t("The foundations")}</h2>
              <p>{t("Four little lessons to get you moving.")}</p>
            </div>
            <span className="path-total">
              {count}
              <small>/ 4</small>
            </span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${count * 25}%` }} />
          </div>
          <LessonList
            style={style}
            completed={progress.completed}
            onOpen={onOpen}
            startingStage={progress.stages[style]}
          />
          {count === 4 && (
            <p className="path-done">
              <Check size={17} />
              {t("Foundations complete. Keep practicing to make them yours.")}
            </p>
          )}
        </section>
        <aside className="path-aside">
          <RhythmArt style={style} />
          <div>
            <span className="eyebrow">
              {t("THE FEEL OF {style}", {
                style: styles[style].name.toUpperCase(),
              })}
            </span>
            <h2>{styles[style].timing}</h2>
            <p>{styles[style].description}</p>
            <a
              className="text-button"
              href={styles[style].source}
              target="_blank"
              rel="noreferrer"
            >
              {t("Explore with Dance Dojo")}
              <ExternalLink size={14} />
              <span className="sr-only">{t(" (opens in a new tab)")}</span>
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}

function SourceForm({
  style,
  onAdd,
  onClose,
}: {
  style: Style;
  onAdd: (source: Source) => void;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const { styles } = useContent();
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    formRef.current?.querySelector("input")?.focus();
  }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title")).trim();
    const url = normalizeUrl(String(data.get("url")));
    if (!title) {
      setError("Give your source a name.");
      return;
    }
    if (!url) {
      setError(
        "Enter a complete web address starting with https:// or http://.",
      );
      return;
    }
    onAdd({
      id: crypto.randomUUID(),
      title,
      url,
      style,
      kind: sourceKind(url),
    });
  }
  return (
    <form ref={formRef} className="source-form" onSubmit={submit} noValidate>
      <div className="form-heading">
        <div>
          <span className="eyebrow">{t("SAVE SOMETHING THAT MOVES YOU")}</span>
          <h2>
            {t("Add a {style} source", {
              style: styles[style].name.toLowerCase(),
            })}
          </h2>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label={t("Cancel adding source")}
          onClick={onClose}
        >
          <X size={19} />
        </button>
      </div>
      <label htmlFor="source-title">{t("Name")}</label>
      <input
        id="source-title"
        name="title"
        placeholder={t("e.g. My favorite basic step tutorial")}
        maxLength={120}
        required
      />
      <label htmlFor="source-url">{t("Link")}</label>
      <input
        id="source-url"
        name="url"
        type="url"
        placeholder="https://…"
        required
        aria-describedby={error ? "source-error" : undefined}
        aria-invalid={error ? true : undefined}
      />
      <p className="small muted">
        {t(
          "YouTube, an article, a social account. Keep your inspiration in one place.",
        )}
      </p>
      {error && (
        <p id="source-error" className="form-error" role="alert">
          {t(error)}
        </p>
      )}
      <button className="button primary" type="submit">
        {t("Save source")}
        <Plus size={16} />
      </button>
    </form>
  );
}

function MyLibrary({
  style,
  progress,
  onChange,
}: {
  style: Style;
  progress: Progress;
  onChange: (updater: (value: Progress) => Progress) => void;
}) {
  const { t } = useLanguage();
  const { styles } = useContent();
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState<{
    message: string;
    title?: string;
  } | null>(null);
  const sources = progress.sources.filter((source) => source.style === style);
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("YOUR OWN CORNER OF INSPIRATION")}</span>
          <h1>
            {t("Good things.")}
            <br className="mobile-break" /> <em>{t("Saved for later.")}</em>
          </h1>
          <p>
            {t(
              "Bring your favorite {style} lessons, videos and creators together.",
              { style: styles[style].name.toLowerCase() },
            )}
          </p>
        </div>
        {!adding && (
          <button className="button primary" onClick={() => setAdding(true)}>
            <Plus size={17} />
            {t("Add source")}
          </button>
        )}
      </div>
      <p className="sr-only" role="status">
        {notice ? t(notice.message, { title: notice.title ?? "" }) : ""}
      </p>
      {adding && (
        <SourceForm
          style={style}
          onClose={() => setAdding(false)}
          onAdd={(source) => {
            onChange((value) => ({
              ...value,
              sources: [...value.sources, source],
            }));
            setAdding(false);
            setNotice({ message: "Source saved." });
          }}
        />
      )}
      {sources.length === 0 ? (
        <section className="library-empty">
          <span className="empty-icon">
            <BookOpen size={34} strokeWidth={1.3} />
          </span>
          <span className="eyebrow">
            {t("A LITTLE INSPIRATION GOES A LONG WAY")}
          </span>
          <h2>{t("Your library starts with a spark.")}</h2>
          <p>
            {t("Found a video that made a step click?")}
            <br />
            {t("Save it here and come back whenever you need it.")}
          </p>
          {!adding && (
            <button className="button outline" onClick={() => setAdding(true)}>
              {t("Save your first source")}
              <Plus size={16} />
            </button>
          )}
        </section>
      ) : (
        <div className="source-grid">
          {sources.map((source) => (
            <article className="source-card" key={source.id}>
              <div className="source-card-top">
                <span className="source-type">
                  {source.kind === t("Video") ? (
                    <AudioLines size={16} />
                  ) : source.kind === t("Social") ? (
                    <Sparkles size={16} />
                  ) : (
                    <BookOpen size={16} />
                  )}
                  {t(source.kind)}
                </span>
                <button
                  className="icon-button"
                  aria-label={t("Remove {title}", { title: source.title })}
                  onClick={() => {
                    onChange((value) => ({
                      ...value,
                      sources: value.sources.filter(
                        (item) => item.id !== source.id,
                      ),
                    }));
                    setNotice({
                      message: "{title} removed.",
                      title: source.title,
                    });
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h2>{source.title}</h2>
              <p>{new URL(source.url).hostname.replace(/^www\./, "")}</p>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-button"
              >
                {t("Open source")}
                <MoveUpRight size={16} />
                <span className="sr-only">{t(" (opens in a new tab)")}</span>
              </a>
            </article>
          ))}
        </div>
      )}
      <div className="library-note">
        <Leaf size={18} />
        <p>
          {t(
            "Your sources and progress are saved in this browser. No account, no feed. Just what helps you grow.",
          )}
        </p>
      </div>
    </>
  );
}

function LessonView({
  lesson,
  style,
  onClose,
  onComplete,
}: {
  lesson: Lesson;
  style: Style;
  onClose: () => void;
  onComplete: () => void;
}) {
  const { t } = useLanguage();
  const { styles } = useContent();
  const [stage, setStage] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
    window.scrollTo({ top: 0 });
  }, [stage]);
  return (
    <div className="lesson-page">
      <button className="text-button back-button" onClick={onClose}>
        <ArrowLeft size={16} />
        {t("Back to your practice")}
      </button>
      <div
        className="lesson-stage-indicator"
        role="group"
        aria-label={t("Step {step} of 3", { step: Math.min(stage + 1, 3) })}
      >
        {[t("Learn"), t("Practice"), t("Reflect")].map((label, i) => (
          <span key={label} className={i <= stage ? "active" : ""}>
            <span>{i < stage ? <Check size={12} /> : i + 1}</span>
            {t(label)}
          </span>
        ))}
      </div>
      {stage === 3 ? (
        <section className="completion">
          <span className="completion-icon">
            <Check size={34} />
          </span>
          <span className="eyebrow">
            {t("A LITTLE FURTHER THAN YESTERDAY")}
          </span>
          <h1 ref={heading} tabIndex={-1}>
            {t("Look at you")} <em>{t("go.")}</em>
          </h1>
          <p>
            {t("You made time to move. That’s what counts.")}
            <br />
            {t("“{title}” is complete.", { title: lesson.title })}
          </p>
          <div className="completion-note">
            <Leaf size={18} />
            <span>
              {t("Let this little lesson settle in.")}
              <br />
              {t("Come back tomorrow for your next step.")}
            </span>
          </div>
          <button className="button primary" onClick={onClose}>
            {t("Back to my day")}
            <ArrowRight size={16} />
          </button>
        </section>
      ) : (
        <>
          <div className="lesson-title">
            <span className="eyebrow">
              {styles[style].name.toUpperCase()} {t("FOUNDATIONS")}{" "}
              <span className="separator"> / </span> {lesson.tag.toUpperCase()}
            </span>
            <h1 ref={heading} tabIndex={-1}>
              {stage === 0
                ? lesson.title
                : stage === 1
                  ? t("Make a little room to move.")
                  : t("Let’s make it stick.")}
            </h1>
            <p>
              {stage === 0
                ? lesson.subtitle
                : stage === 1
                  ? t("Follow the visual count. Repeat as often as you like.")
                  : t("One quick question before you go.")}
            </p>
          </div>
          {stage === 0 && (
            <>
              <VideoTutorial lesson={lesson} />
              <div className="learn-grid">
                <section className="lesson-instructions">
                  <p className="lesson-learn">{lesson.learn}</p>
                  <ol>
                    {lesson.steps.map((step, i) => (
                      <li key={step}>
                        <span>{i + 1}</span>
                        <p>{step}</p>
                      </li>
                    ))}
                  </ol>
                  <button
                    className="button primary"
                    onClick={() => setStage(1)}
                  >
                    {t("Try it out")}
                    <ArrowRight size={16} />
                  </button>
                </section>
                <aside className="lesson-tip">
                  <Footprints size={30} strokeWidth={1.3} />
                  <span className="eyebrow">{t("TAKE THIS WITH YOU")}</span>
                  <h2>{lesson.tip}</h2>
                  <p>
                    {t("Keep it small, keep it comfortable.")}
                    <br />
                    {t("You’re learning at your own pace.")}
                  </p>
                  <a
                    className="text-button"
                    href={styles[style].source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("See the foundations")}
                    <ExternalLink size={14} />
                    <span className="sr-only">
                      {t(" (opens in a new tab)")}
                    </span>
                  </a>
                </aside>
              </div>
            </>
          )}
          {stage === 1 && (
            <div className="practice-layout">
              <Practice style={style} />
              <aside className="practice-reminder">
                <span className="eyebrow">{t("YOUR FOCUS")}</span>
                <h2>{styles[style].timing}</h2>
                <p>{lesson.tip}</p>
                <p className="small muted">
                  {t(
                    "Use the count for a minute, or move at your own pace. Continue when you feel ready.",
                  )}
                </p>
                <button className="button primary" onClick={() => setStage(2)}>
                  {t("Ready to reflect")}
                  <ArrowRight size={16} />
                </button>
                <button className="text-button" onClick={() => setStage(0)}>
                  <ArrowLeft size={14} />
                  {t("Revisit the steps")}
                </button>
              </aside>
            </div>
          )}
          {stage === 2 && (
            <section className="quiz">
              <h2>{lesson.question}</h2>
              <div className="quiz-options">
                {lesson.answers.map((option, index) => (
                  <button
                    key={option}
                    className={`quiz-option ${answer === index ? (answer === lesson.correct ? "correct" : "incorrect") : ""}`}
                    onClick={() => setAnswer(index)}
                    aria-pressed={answer === index}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    {option}
                    {answer === index && index === lesson.correct && (
                      <Check size={18} />
                    )}
                  </button>
                ))}
              </div>
              <p
                className={`quiz-feedback ${answer === lesson.correct ? "success" : ""}`}
                role="status"
              >
                {answer === null
                  ? t("Take your time. This is practice, too.")
                  : answer === lesson.correct
                    ? t("That’s it. You’ve got the idea.")
                    : t(
                        "Not quite. Think back to the steps, and have another go.",
                      )}
              </p>
              <div className="quiz-actions">
                <button className="text-button" onClick={() => setStage(0)}>
                  <ArrowLeft size={15} />
                  {t("Review the steps")}
                </button>
                <button
                  className="button primary"
                  disabled={answer !== lesson.correct}
                  onClick={() => {
                    onComplete();
                    setStage(3);
                  }}
                >
                  {t("Finish lesson")}
                  <Check size={16} />
                </button>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function DanceTutor() {
  const { t } = useLanguage();
  const { lessons } = useContent();
  const [progress, setProgress] = useState(loadProgress);
  const [tab, setTab] = useState<Tab>("Today");
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [saveError, setSaveError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [progress]);
  function selectStyle(style: Style, startingStage?: StartingStage) {
    setProgress((value) => ({
      ...value,
      style,
      stages: startingStage
        ? { ...value.stages, [style]: startingStage }
        : value.stages,
    }));
    setLesson(null);
    setTab("Today");
  }
  function changeTab(value: Tab) {
    setTab(value);
    setLesson(null);
    window.scrollTo({ top: 0 });
  }
  function openLesson(value: Lesson) {
    setLesson(value);
    window.scrollTo({ top: 0 });
  }

  if (!progress.style)
    return (
      <>
        <Onboarding onSelect={selectStyle} />
        {saveError && (
          <p className="storage-warning" role="alert">
            {t(
              "Browser storage is unavailable. Your progress will last for this visit only.",
            )}
          </p>
        )}
      </>
    );
  const style = progress.style;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <button
            className="brand-button"
            aria-label={t("Ritmo home")}
            onClick={() => changeTab("Today")}
          >
            <Brand />
          </button>
          <span className="sidebar-tagline">
            {t("A little dance, every day.")}
          </span>
          <div className="style-picker">
            <label htmlFor="dance-style">{t("YOUR DANCE FLOOR")}</label>
            <div>
              <span className={`style-picker-icon ${style}`}>
                <Footprints size={19} />
              </span>
              <select
                id="dance-style"
                aria-label={t("YOUR DANCE FLOOR")}
                value={style}
                onChange={(event) => selectStyle(event.target.value as Style)}
              >
                <option value="salsa">Salsa</option>
                <option value="bachata">Bachata</option>
              </select>
              <ChevronDown size={15} />
            </div>
          </div>
          <nav aria-label={t("Main navigation")}>
            {tabs.map(({ name, icon: Icon }) => (
              <button
                key={t(name)}
                className={name === tab ? "nav-item active" : "nav-item"}
                onClick={() => changeTab(name)}
                aria-current={!lesson && name === tab ? "page" : undefined}
              >
                <Icon size={19} strokeWidth={1.7} />
                {t(name)}
                {name === tab && <span />}
              </button>
            ))}
          </nav>
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-spark">
              <Sparkles size={21} strokeWidth={1.4} />
            </span>
            <p>
              {t("Progress is a practice,")}
              <br />
              <em>{t("not a destination.")}</em>
            </p>
          </div>
          <div className="local-note">
            <span className="tiny-dot" />
            {t("Just you. No account needed.")}
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="app-header">
          <span className="breadcrumb">
            {t("Your space to move")}
            <span>/</span>{" "}
            <strong>{lesson ? t("A little lesson") : t(tab)}</strong>
          </span>
          <div className="header-controls">
            <span className="header-motto">
              <span className="tiny-dot" />
              {t("ONE STEP AT A TIME")}
            </span>
            <LanguagePicker />
          </div>
        </header>
        <main id="main-content" className="main-content">
          {saveError && (
            <p className="storage-warning" role="alert">
              {t(
                "Browser storage is unavailable. Your progress will last for this visit only.",
              )}
            </p>
          )}
          {lesson ? (
            <LessonView
              key={lesson.id}
              lesson={lessons[style].find((item) => item.id === lesson.id)!}
              style={style}
              onClose={() => setLesson(null)}
              onComplete={() =>
                setProgress((value) => completeLesson(value, lesson.id))
              }
            />
          ) : tab === "Today" ? (
            <Today
              style={style}
              progress={progress}
              onOpen={openLesson}
              onTab={changeTab}
            />
          ) : tab === "Learning path" ? (
            <LearningPath
              style={style}
              progress={progress}
              onOpen={openLesson}
              onStageChange={(stage) =>
                setProgress((value) => ({
                  ...value,
                  stages: { ...value.stages, [style]: stage },
                }))
              }
            />
          ) : (
            <MyLibrary
              key={style}
              style={style}
              progress={progress}
              onChange={setProgress}
            />
          )}
        </main>
        <footer className="app-footer">
          <span>{t("Small steps. Every day.")}</span>
          <span>{t("Made for the joy of moving.")}</span>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <DanceTutor />
    </LanguageProvider>
  );
}
