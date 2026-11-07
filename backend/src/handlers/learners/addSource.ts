import {
  badRequest,
  isStyle,
  isUuid,
  noContent,
  parseBody,
} from "../../http";
import { learnerHandler } from "../../learner";
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

export const handler = learnerHandler(async (learner, event) => {
  const body = parseBody(event);
  if (!isSource(body)) return badRequest("Invalid source");
  const { id, title, url, style, kind } = body as Source;
  await addSource(learner, { id, title, url, style, kind });
  return noContent();
});
