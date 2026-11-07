import { badRequest, isUuid, noContent } from "../../http";
import { learnerHandler } from "../../learner";
import { removeSource } from "../../progress";

export const handler = learnerHandler(async (learner, event) => {
  const source = event.pathParameters?.source;
  if (!isUuid(source)) return badRequest("Invalid source id");
  await removeSource(learner, source);
  return noContent();
});
