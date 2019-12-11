import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const dbPAth = "./db.json";

// TODO: Create path if missing:
const adapter = new FileSync(dbPAth);
const db = low(adapter);

type DeliveredMap = { [address: string]: string };

export default function getToken(address: string): string {
  const deliveredToFind: DeliveredMap = db.get("delivered").value();

  if (deliveredToFind[address]) {
    return deliveredToFind[address];
  }

  const pool: string[] = db.get("pool").value();

  if (pool.length === 0) {
    throw new Error("The token pool is empty");
  }
  const deliveredToken: string = pool.pop() || "";

  // Save pool without the token taken
  db.set("pool", pool).write();

  // Insert new address to the delivered map
  deliveredToFind[address] = deliveredToken;
  db.set("delivered", deliveredToFind).write();

  return deliveredToken;
}
