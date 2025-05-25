import { Router } from "express";
import { z } from "zod";
import { ingest, StatBlobSchema } from "../services/ingestService";

const router = Router();

const bodySchema = z.array(StatBlobSchema);

router.post("/", (req: import("express").Request, res: import("express").Response) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid body", details: parsed.error.errors });
  }
  ingest(parsed.data);
  res.status(204).send();
});

export default router; 