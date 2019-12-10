import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const dbPAth = 'data/db.json';

// TODO: Create path if missing:
const adapter = new FileSync(dbPAth);
const db = low(adapter)
