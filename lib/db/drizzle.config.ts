import { defineConfig } from "drizzle-kit";
import path from "path";

const connectionString =
  process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

const isRemote =
  !connectionString.includes("localhost") &&
  !connectionString.includes("127.0.0.1");

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
  },
});
