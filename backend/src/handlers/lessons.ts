import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { getLessons } from "../content";
import {
  badLanguage,
  json,
  parseLanguage,
  parseStyle,
  unknownStyle,
} from "../http";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const language = parseLanguage(event);
  if (!language) return badLanguage();
  const style = parseStyle(event);
  if (!style) return unknownStyle();
  return json(200, getLessons(style, language));
};
