import type { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as accounts from "../accounts";
import { handler as config } from "./config";
import { handler as link } from "./link";

vi.mock("../accounts");

const guest = "6f1c2b9e-3d4a-4c5b-8e7f-0a1b2c3d4e5f";

function linkRequest(body: unknown) {
  return {
    body: JSON.stringify(body),
    requestContext: { authorizer: { jwt: { claims: { sub: "user-1" } } } },
  } as unknown as APIGatewayProxyEventV2WithJWTAuthorizer;
}

beforeEach(() => vi.resetAllMocks());

describe("account handlers", () => {
  it("links the guest learner and returns the account's learner", async () => {
    vi.mocked(accounts.linkAccount).mockResolvedValue(guest);
    const result = await link(linkRequest({ learnerId: guest }));
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body ?? "")).toEqual({ learnerId: guest });
    expect(accounts.linkAccount).toHaveBeenCalledWith("user-1", guest);
  });

  it("rejects an invalid guest learner id", async () => {
    const result = await link(linkRequest({ learnerId: "nope" }));
    expect(result.statusCode).toBe(400);
    expect(accounts.linkAccount).not.toHaveBeenCalled();
  });

  it("serves the sign-in configuration", async () => {
    vi.stubEnv("AUTH_ISSUER", "https://issuer");
    vi.stubEnv("AUTH_DOMAIN", "login.example.com");
    vi.stubEnv("AUTH_CLIENT_ID", "client");
    expect(JSON.parse((await config()).body ?? "")).toEqual({
      authority: "https://issuer",
      domain: "login.example.com",
      clientId: "client",
    });
  });
});
