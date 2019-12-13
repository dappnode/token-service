import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const dbPAth = "./db.json";

const adapter = new FileSync(dbPAth);

type DeliveredMap = { [address: string]: string };

// Initial empty db
// db.defaults({ delivered: {},pool: []}).write();

export default function getToken(address: string): string {
  const db = low(adapter);
  const deliveredToFind: DeliveredMap = db.get("delivered").value();

  if (deliveredToFind && deliveredToFind[address]) {
    return deliveredToFind[address];
  }

  const pool = db.get("pool").value();

  if (
    db
      .get("pool")
      .size()
      .value() === 0
  ) {
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
