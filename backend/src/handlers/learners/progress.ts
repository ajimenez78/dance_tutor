import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { badLearner, json, parseLearner } from "../../http";
import { getProgress } from "../../progress";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const learner = parseLearner(event);
  if (!learner) return badLearner();
  return json(200, await getProgress(learner));
};
