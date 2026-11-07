import type { APIGatewayProxyEventV2 } from "aws-lambda";
import {
  badLearner,
  badRequest,
  noContent,
  parseBody,
  parseLearner,
  parseStyle,
  unknownStyle,
} from "../../http";
import { setStage, type StartingStage } from "../../progress";

const stages: unknown[] = ["rhythm", "basics", "flow"] satisfies StartingStage[];

export const handler = async (event: APIGatewayProxyEventV2) => {
  const learner = parseLearner(event);
  if (!learner) return badLearner();
  const style = parseStyle(event);
  if (!style) return unknownStyle();
  const { stage } = parseBody(event);
  if (!stages.includes(stage)) return badRequest("Invalid stage");
  await setStage(learner, style, stage as StartingStage);
  return noContent();
};
