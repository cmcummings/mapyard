import express from "express";
import { z } from "zod";
import { isObjectId, Map } from "../db";

const maps = express();

const zMapsGetQuery = z.object({
  id: z.string().refine(isObjectId).optional(),
});

maps.get("/", async (req, res) => {
  const pq = zMapsGetQuery.safeParse(req.query);
  if (!pq.success) {
    res.status(400).send();
    return;
  }

  const query = pq.data;
  
  if (query.id) {
    const map = await Map.findOne({ _id: query.id });
    if (!map) {
      res.status(404).send();
      return;
    }

    res.json([map.toJSON()]);
  } else if (req.session.user) {
    const maps = await Map.find({ creator: req.session.user });
    res.json(maps);
  } else {
    res.status(404).send();
  }
});


const zMapsPostBody = z.object({
  id: z.string().refine(isObjectId).optional(),
  updates: z.object({
    name: z.string(),
    public: z.boolean(),
    objects: z.object({
      nodes: z.array(z.object({ x: z.number(), y: z.number() })),
      roads: z.array(z.object({
        start: z.number(),
        end: z.number(),
        direction: z.string(),
        label: z.string().optional()
      })),
      buildings: z.array(z.object({
        x: z.number(),
        y: z.number(),
        label: z.string().optional()
      }).and(
        z.object({
          type: z.literal("rectangular"),
          width: z.number(),
          height: z.number(),
          rotation: z.number()
        }).or(z.object({
          type: z.literal("circular"),
          radius: z.number()
        }))
      ))
    }).optional()
  }).partial().optional()
});

maps.post("/", async (req, res) => {
  const pb = zMapsPostBody.safeParse(req.body);
  if (!pb.success) {
    res.status(400).send();
    return;
  }

  if (!req.session.user) {
    res.status(401).json({ message: "Not logged in." });
    return;
  }

  const body = pb.data;

  let map;
  if (body.id) {
    map = await Map.findOne({ _id: body.id });
    if (map && map.creator.toString() !== req.session.user) {
      res.status(401).send();
      return;
    }

    map = await Map.findOneAndUpdate(
      { _id: body.id }, 
      { creator: req.session.user, ...body.updates }, 
      { returnDocument: "after" }
    );
  } else {
    console.log("Creating map for user", req.session.user);
    map = await Map.create({ creator: req.session.user });
  }

  if (map) { 
    res.json(map.toJSON());
  } else {
    res.status(500).send();
  }
});


const zMapsDeleteBody = z.object({
  id: z.string()
});

maps.delete("/", async (req, res) => {
  const pb = zMapsDeleteBody.safeParse(req.body);
  if (!pb.success) {
    res.status(400).send();
    return;
  }

  const body = pb.data;

  await Map.deleteOne({ _id: body.id });

  res.status(200).send();
});

export default maps;
