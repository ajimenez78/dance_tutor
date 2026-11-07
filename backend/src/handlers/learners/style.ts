import type { APIGatewayProxyEventV2 } from "aws-lambda";
import {
  badLearner,
  badRequest,
  isStyle,
  noContent,
  parseBody,
  parseLearner,
} from "../../http";
import { setStyle } from "../../progress";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const learner = parseLearner(event);
  if (!learner) return badLearner();
  const { style } = parseBody(event);
  if (!isStyle(style)) return badRequest("Invalid style");
  await setStyle(learner, style);
  return noContent();
};
