import { badRequest, isStyle, noContent, parseBody } from "../../http";
import { learnerHandler } from "../../learner";
import { setStyle } from "../../progress";

export const handler = learnerHandler(async (learner, event) => {
  const { style } = parseBody(event);
  if (!isStyle(style)) return badRequest("Invalid style");
  await setStyle(learner, style);
  return noContent();
});
