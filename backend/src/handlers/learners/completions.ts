import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { lessonIds } from "../../content";
import {
  badLearner,
  badRequest,
  noContent,
  parseBody,
  parseLearner,
} from "../../http";
import { completeLesson } from "../../progress";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const learner = parseLearner(event);
  if (!learner) return badLearner();
  const { lessonId, day } = parseBody(event);
  if (typeof lessonId !== "string" || !lessonIds.has(lessonId))
    return badRequest("Unknown lesson");
  if (typeof day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day))
    return badRequest("day must be YYYY-MM-DD");
  await completeLesson(learner, lessonId, day);
  return noContent();
};
