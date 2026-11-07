import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { describe, expect, it } from "vitest";
import { getLessons, getPlaylist, getStyles } from "../content";
import { handler as health } from "./health";
import { handler as lessons } from "./lessons";
import { handler as playlist } from "./playlist";
import { handler as styles } from "./styles";

function request(
  query?: Record<string, string>,
  path?: Record<string, string>,
) {
  return {
    queryStringParameters: query,
    pathParameters: path,
  } as APIGatewayProxyEventV2;
}

function body(result: { body?: string }) {
  return JSON.parse(result.body ?? "");
}

describe("handlers", () => {
  it("reports health", async () => {
    const result = await health();
    expect(result.statusCode).toBe(200);
    expect(body(result)).toEqual({ status: "ok" });
  });

  it("serves JSON content in Spanish by default", async () => {
    const result = await styles(request());
    expect(result.statusCode).toBe(200);
    expect(result.headers).toEqual({ "content-type": "application/json" });
    expect(body(result)).toEqual(getStyles("es"));
  });

  it("serves the requested language and style", async () => {
    expect(body(await styles(request({ lang: "en" })))).toEqual(
      getStyles("en"),
    );
    expect(
      body(await lessons(request({ lang: "en" }, { style: "salsa" }))),
    ).toEqual(getLessons("salsa", "en"));
    expect(
      body(await playlist(request({ lang: "es" }, { style: "bachata" }))),
    ).toEqual(getPlaylist("bachata", "es"));
  });

  it("rejects unsupported languages", async () => {
    for (const result of [
      await styles(request({ lang: "fr" })),
      await lessons(request({ lang: "fr" }, { style: "salsa" })),
      await playlist(request({ lang: "fr" }, { style: "salsa" })),
    ]) {
      expect(result.statusCode).toBe(400);
      expect(body(result).error).toMatch(/lang/);
    }
  });

  it("returns 404 for unknown styles", async () => {
    for (const result of [
      await lessons(request({}, { style: "tango" })),
      await playlist(request({}, { style: "tango" })),
    ]) {
      expect(result.statusCode).toBe(404);
      expect(body(result)).toEqual({ error: "Unknown style" });
    }
  });
});
