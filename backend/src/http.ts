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

export function parseStyle(event: APIGatewayProxyEventV2): Style | null {
  const style = event.pathParameters?.style;
  return style === "salsa" || style === "bachata" ? style : null;
}

export const badLanguage = () =>
  json(400, { error: "lang must be 'es' or 'en'" });
export const unknownStyle = () => json(404, { error: "Unknown style" });
