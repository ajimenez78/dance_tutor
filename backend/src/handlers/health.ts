import { json } from "../http";

export const handler = async () => json(200, { status: "ok" });
