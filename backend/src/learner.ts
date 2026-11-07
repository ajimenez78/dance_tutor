import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { accountLearner, isLinked } from "./accounts";
import { badLearner, isUuid, json } from "./http";

type Handle = (
  learner: string,
  event: APIGatewayProxyEventV2,
) => Promise<APIGatewayProxyStructuredResultV2>;

export const accountSub = (event: APIGatewayProxyEventV2) =>
  (event as APIGatewayProxyEventV2WithJWTAuthorizer).requestContext.authorizer
    ?.jwt.claims.sub as string | undefined;

// One handler serves both routes. API Gateway sets JWT claims only on the
// /api/me routes, after verifying the token, so the account's learner comes
// from the token. Guest routes take the learner from the path, unless it now
// belongs to an account.
export function learnerHandler(handle: Handle) {
  return async (event: APIGatewayProxyEventV2) => {
    const sub = accountSub(event);
    if (sub) {
      const learner = await accountLearner(sub);
      if (!learner) return json(404, { error: "Account not linked" });
      return handle(learner, event);
    }
    const learner = event.pathParameters?.learner;
    if (!isUuid(learner)) return badLearner();
    if (await isLinked(learner))
      return json(403, { error: "Learner belongs to an account" });
    return handle(learner, event);
  };
}
