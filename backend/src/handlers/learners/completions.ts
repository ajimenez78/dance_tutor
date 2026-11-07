import { lessonIds } from "../../content";
import { badRequest, noContent, parseBody } from "../../http";
import { learnerHandler } from "../../learner";
import { completeLesson } from "../../progress";

export const handler = learnerHandler(async (learner, event) => {
  const { lessonId, day } = parseBody(event);
  if (typeof lessonId !== "string" || !lessonIds.has(lessonId))
    return badRequest("Unknown lesson");
  if (typeof day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day))
    return badRequest("day must be YYYY-MM-DD");
  await completeLesson(learner, lessonId, day);
  return noContent();
});
