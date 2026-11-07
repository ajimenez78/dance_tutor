import { DsqlSigner } from "@aws-sdk/dsql-signer";
import pg from "pg";

const hostname = process.env.DSQL_ENDPOINT ?? "";
const signer = new DsqlSigner({ hostname });

export const pool = new pg.Pool({
  host: hostname,
  user: "admin",
  database: "postgres",
  port: 5432,
  ssl: true,
  max: 1,
  password: () => signer.getDbConnectAdminAuthToken(),
});
