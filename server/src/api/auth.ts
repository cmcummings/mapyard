import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../db";

const auth = express();

const zRegisterBody = z.object({
  username: z.string(),
  password: z.string()
});

auth.post("/register", async (req, res, next) => {
  const pb = zRegisterBody.safeParse(req.body);
  if (!pb.success) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }

  const body = pb.data;

  const salt = bcrypt.genSaltSync(10);
  const pwHash = bcrypt.hashSync(body.password, salt);

  if (await User.exists({ name: body.username })) {
    res.status(409).json({ message: "User already exists" });
    return;
  }

  const user = await User.create({ name: body.username, password: pwHash });
  
  req.session.regenerate(err => {
    if (err) { 
      next(err); 
      return; 
    }

    req.session.user = user._id.toString();

    req.session.save(err => {
      if (err) {
        next(err);
        return;
      }

      res.status(200).send();
    });
  });
});


const zLoginBody = z.object({
  username: z.string(),
  password: z.string()
})

auth.post("/login", async (req, res, next) => {
  const pb = zLoginBody.safeParse(req.body);
  if (!pb.success) {
    res.status(400).send();
    return;
  }   

  const body = pb.data;

  const user = await User.findOne({ name: body.username });

  if (!user || !bcrypt.compareSync(body.password, user.password)) {
    res.status(401).send();
    return;
  }
  
  req.session.regenerate(err => {
    if (err) { 
      next(err); 
      return; 
    }

    req.session.user = user._id.toString();

    req.session.save(err => {
      if (err) {
        next(err);
        return;
      }

      res.status(200).send();
    });
  });
});


auth.post("/logout", (req, res, next) => {
  if (!req.session.user) {
    res.status(401).json({ message: "Not logged in." });
    return;
  }

  req.session.user = undefined;

  req.session.save(err => {
    if (err) {
      next(err);
      return;
    }

    req.session.regenerate(err => {
      if (err) {
        next(err);
        return;
      }

      res.status(200).send();
    });
  });
});

export default auth;
