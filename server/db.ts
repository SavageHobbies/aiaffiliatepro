import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV !== "development") {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  } else {
    console.warn("DATABASE_URL not set, bypassing database in development mode.");
  }
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
