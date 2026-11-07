import { useEffect, useRef, useState } from "react";
import { completeLesson, dateKey } from "./model";
import type { Progress, Source, StartingStage } from "./model";
import type { Style } from "./types";

export const LEARNER_KEY = "ritmo-learner";

// The anonymous learner ID lives in the browser; progress lives in the API.
// Without browser storage the ID, and so the progress, lasts for this visit.
function loadLearner(): { id: string; remembered: boolean } {
  try {
    const stored = localStorage.getItem(LEARNER_KEY);
    if (stored) return { id: stored, remembered: true };
    const id = crypto.randomUUID();
    localStorage.setItem(LEARNER_KEY, id);
    return { id, remembered: true };
  } catch {
    return { id: crypto.randomUUID(), remembered: false };
  }
}

// Once signed in, the browser starts a new guest for when the learner signs
// out: the old guest is now the account's, or no longer needed.
function renewGuest() {
  try {
    localStorage.setItem(LEARNER_KEY, crypto.randomUUID());
  } catch {
    /* Without browser storage the next visit starts a new guest anyway. */
  }
}

export type Account = { sub: string; token: string };

async function send(
  path: string,
  method: string,
  body?: unknown,
  token?: string,
) {
  const headers: Record<string, string> = {};
  if (body) headers["content-type"] = "application/json";
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await fetch(path, {
    method,
    keepalive: true,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`${method} ${path}: ${response.status}`);
  return response;
}

async function linkGuest(guestId: string, token: string) {
  await send("/api/me/link", "POST", { learnerId: guestId }, token);
  renewGuest();
}

export function useProgress(account: Account | null = null) {
  const [learner] = useState(loadLearner);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  // Token renewals must not reload progress, so requests read the latest one.
  const token = useRef(account?.token);
  token.current = account?.token;
  const sub = account?.sub;
  const base = sub ? "/api/me" : `/api/learners/${learner.id}`;

  useEffect(() => {
    let current = true;
    setFailed(false);
    const linked = sub ? linkGuest(learner.id, token.current!) : Promise.resolve();
    linked
      .then(() => send(`${base}/progress`, "GET", undefined, token.current))
      .then((response) => response.json())
      .then(
        (value: Progress) => current && setProgress(value),
        () => current && setFailed(true),
      );
    return () => {
      current = false;
    };
  }, [base, sub, learner.id, attempt]);

  function save(
    update: (value: Progress) => Progress,
    requests: [path: string, method: string, body?: unknown][],
  ) {
    setProgress((value) => value && update(value));
    // Saves run one at a time, in the order the learner made them.
    for (const [path, method, body] of requests)
      queue.current = queue.current.then(() =>
        send(`${base}${path}`, method, body, token.current),
      );
    queue.current = queue.current.catch(() => setFailed(true));
  }

  return {
    progress,
    failed,
    remembered: learner.remembered,
    retry: () => setAttempt((value) => value + 1),
    selectStyle(style: Style, stage?: StartingStage) {
      save(
        (value) => ({
          ...value,
          style,
          stages: stage ? { ...value.stages, [style]: stage } : value.stages,
        }),
        [
          ["/style", "PUT", { style }],
          ...(stage
            ? [[`/stages/${style}`, "PUT", { stage }] as [string, string, unknown]]
            : []),
        ],
      );
    },
    setStage(style: Style, stage: StartingStage) {
      save(
        (value) => ({ ...value, stages: { ...value.stages, [style]: stage } }),
        [[`/stages/${style}`, "PUT", { stage }]],
      );
    },
    complete(lessonId: string) {
      const now = new Date();
      save(
        (value) => completeLesson(value, lessonId, now),
        [["/completions", "POST", { lessonId, day: dateKey(now) }]],
      );
    },
    addSource(source: Source) {
      save(
        (value) => ({ ...value, sources: [...value.sources, source] }),
        [["/sources", "POST", source]],
      );
    },
    removeSource(id: string) {
      save(
        (value) => ({
          ...value,
          sources: value.sources.filter((source) => source.id !== id),
        }),
        [[`/sources/${id}`, "DELETE"]],
      );
    },
  };
}
