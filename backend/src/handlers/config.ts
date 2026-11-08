import { json } from "../http";

export const handler = async () =>
  json(200, {
    authority: process.env.AUTH_ISSUER,
    domain: process.env.AUTH_DOMAIN,
    clientId: process.env.AUTH_CLIENT_ID,
  });
