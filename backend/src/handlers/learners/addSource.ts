import type { APIGatewayProxyEventV2 } from "aws-lambda";
import {
  badLearner,
  badRequest,
  isStyle,
  isUuid,
  noContent,
  parseBody,
  parseLearner,
} from "../../http";
import { addSource, type Source } from "../../progress";

const kinds: unknown[] = ["Video", "Social", "Article"] satisfies Source["kind"][];

function isWebUrl(value: unknown) {
  return (
    typeof value === "string" && URL.canParse(value) &&
    ["https:", "http:"].includes(new URL(value).protocol)
  );
}

function isSource(value: Record<string, unknown>): boolean {
  const { id, title, url, style, kind } = value;
  return (
    isUuid(id) &&
    typeof title === "string" &&
    title.trim().length > 0 &&
    title.length <= 120 &&
    isWebUrl(url) &&
    isStyle(style) &&
    kinds.includes(kind)
  );
}

export const handler = async (event: APIGatewayProxyEventV2) => {
  const learner = parseLearner(event);
  if (!learner) return badLearner();
  const body = parseBody(event);
  if (!isSource(body)) return badRequest("Invalid source");
  const { id, title, url, style, kind } = body as Source;
  await addSource(learner, { id, title, url, style, kind });
  return noContent();
};
