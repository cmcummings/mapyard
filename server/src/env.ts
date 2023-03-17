import * as dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const SESSION_SECRET = process.env.SESSION_SECRET || "foo";
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME!;
export const MONGO_CONN_STRING = process.env.MONGO_CONN_STRING!;
