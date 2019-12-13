import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const config = require("../config");
const dbPAth = "./db.json";
const adapter = new FileSync(dbPAth);

export default function addToken(token: string, secret: string): void {
  const db = low(adapter);

  const pool = db.get("pool").value();
  if (pool.includes(token)) {
    throw new Error("Token already exists in pool.");
  }
  if (secret === config.secret) {
    pool.push(token);
    db.set("pool", pool).write();
  } else {
    throw new Error("Invalid secret provided.");
  }

  return;
}
