import { Pool } from "pg";

// Create a connection pool to Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
