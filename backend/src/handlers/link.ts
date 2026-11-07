import type { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { linkAccount } from "../accounts";
import { badLearner, isUuid, json, parseBody } from "../http";

export const handler = async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
  const { learnerId } = parseBody(event);
  if (!isUuid(learnerId)) return badLearner();
  const sub = String(event.requestContext.authorizer.jwt.claims.sub);
  return json(200, { learnerId: await linkAccount(sub, learnerId) });
};
