import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { getStyles } from "../content";
import { badLanguage, json, parseLanguage } from "../http";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const language = parseLanguage(event);
  if (!language) return badLanguage();
  return json(200, getStyles(language));
};
