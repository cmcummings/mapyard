import express from "express";
import session from "express-session";
import cors from "cors";
import auth from "./api/auth";
import maps from "./api/maps";
import users from "./api/users";
import { MongoSessionStore } from "./db";
import { PORT, SESSION_SECRET } from "./env";
import * as path from "path";

declare module "express-session" {
  interface SessionData {
    user: string // The user's id
  }
}

const app = express();

app.use(cors({
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoSessionStore,
  cookie: {
    sameSite: "strict",
  }
}));

const api = express();
api.use("/auth", auth);
api.use("/maps", maps);
api.use("/users", users);
app.use("/api", api);

app.use(express.static(path.join(__dirname, "../../client/dist")));
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
