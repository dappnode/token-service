import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const config = require("../config");
const dbPAth = "./db.json";
const adapter = new FileSync(dbPAth);

class ExpectedError extends Error {}

export default function addToken(token: string, secret: string): void {
  const db = low(adapter);

  const pool = db.get("pool").value();
  if (pool.includes(token)) {
    throw new ExpectedError("Token already exists in pool.");
  }
  if (secret === config.secret) {
    pool.push(token);
    db.set("pool", pool).write();
    console.log("Token added to pool: ", token);
  } else {
    throw new ExpectedError("Invalid secret provided.");
  }

  return;
}
