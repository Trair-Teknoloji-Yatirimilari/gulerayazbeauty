import { Pool } from "pg";

let _pool: Pool | undefined;

export function db(): Pool {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL ortam değişkeni tanımlı değil.");
    }
    _pool = new Pool({ connectionString, max: 10 });
  }
  return _pool;
}
