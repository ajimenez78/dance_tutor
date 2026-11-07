import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import type { Language, Style } from "./content";

export function json(
  statusCode: number,
  body: unknown,
): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

export function parseLanguage(event: APIGatewayProxyEventV2): Language | null {
  const language = event.queryStringParameters?.lang ?? "es";
  return language === "es" || language === "en" ? language : null;
}

export const isStyle = (value: unknown): value is Style =>
  value === "salsa" || value === "bachata";

export function parseStyle(event: APIGatewayProxyEventV2): Style | null {
  const style = event.pathParameters?.style;
  return isStyle(style) ? style : null;
}

export const isUuid = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export function parseLearner(event: APIGatewayProxyEventV2): string | null {
  const learner = event.pathParameters?.learner;
  return isUuid(learner) ? learner : null;
}

export function parseBody(event: APIGatewayProxyEventV2): Record<string, unknown> {
  try {
    return JSON.parse(event.body ?? "{}") ?? {};
  } catch {
    return {};
  }
}

export const badLanguage = () =>
  json(400, { error: "lang must be 'es' or 'en'" });
export const unknownStyle = () => json(404, { error: "Unknown style" });
export const badRequest = (error: string) => json(400, { error });
export const badLearner = () => badRequest("Invalid learner id");
export const noContent = (): APIGatewayProxyStructuredResultV2 => ({
  statusCode: 204,
});
