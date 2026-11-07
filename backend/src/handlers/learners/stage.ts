import {
  badRequest,
  noContent,
  parseBody,
  parseStyle,
  unknownStyle,
} from "../../http";
import { learnerHandler } from "../../learner";
import { setStage, type StartingStage } from "../../progress";

const stages: unknown[] = ["rhythm", "basics", "flow"] satisfies StartingStage[];

export const handler = learnerHandler(async (learner, event) => {
  const style = parseStyle(event);
  if (!style) return unknownStyle();
  const { stage } = parseBody(event);
  if (!stages.includes(stage)) return badRequest("Invalid stage");
  await setStage(learner, style, stage as StartingStage);
  return noContent();
});
