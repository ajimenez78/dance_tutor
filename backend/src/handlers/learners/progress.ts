import { json } from "../../http";
import { learnerHandler } from "../../learner";
import { getProgress } from "../../progress";

export const handler = learnerHandler(async (learner) =>
  json(200, await getProgress(learner)),
);
