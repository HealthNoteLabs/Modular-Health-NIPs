import { Router } from "express";
import metricsData from "../data/metrics";

const router = Router();

router.get("/", (_req, res) => {
  res.json(metricsData);
});

export default router; 