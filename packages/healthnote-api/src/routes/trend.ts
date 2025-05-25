import { Router } from "express";
import { computeTrend } from "../services/trendService";

const router = Router();

router.get("/", (req: import("express").Request, res: import("express").Response) => {
  const kind = Number(req.query.kind);
  if (Number.isNaN(kind)) {
    return res.status(400).json({ error: "kind is required and must be number" });
  }
  const bucket = (req.query.bucket as string) || "day";
  const stat = (req.query.stat as string) || "mean";
  const epsilon = req.query.epsilon ? Number(req.query.epsilon) : undefined;

  try {
    const result = computeTrend({ kind, bucket: bucket as any, stat: stat as any, epsilon });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: "server_error", details: (e as Error).message });
  }
});

export default router; 