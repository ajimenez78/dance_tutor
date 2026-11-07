import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { badLearner, badRequest, isUuid, noContent, parseLearner } from "../../http";
import { removeSource } from "../../progress";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const learner = parseLearner(event);
  if (!learner) return badLearner();
  const source = event.pathParameters?.source;
  if (!isUuid(source)) return badRequest("Invalid source id");
  await removeSource(learner, source);
  return noContent();
};
