import express from "express";

const users = express();

users.post("/", (req, res) => {
  // If user does not exist, create user
  // Generate session cookie and send it to user
  res.status(200).json({
    id: 1,
    name: "Connor",
  });
});

users.get("/", (req, res) => {
  // If requested user does not exist or requesting user is not authorized, throw 403 Forbidden
  // Otherwise, return requested user info
  res.json({
    id: 1,
    name: "Connor"
  }); 
});

export default users;
