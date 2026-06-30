import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load local environment variables
dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'turso', // Drizzle Kit uses 'turso' dialect for remote libsql databases!
  dbCredentials: {
    url: process.env.DATABASE_URL || 'file:local.db',
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
