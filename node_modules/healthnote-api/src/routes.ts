import { Router } from "express";
import metricsRouter from "./routes/metrics";
import ingestRouter from "./routes/ingest";
import trendRouter from "./routes/trend";
import correlateRouter from "./routes/correlate";
import distributionRouter from "./routes/distribution";

const router = Router();

router.use("/metrics", metricsRouter);
router.use("/ingest", ingestRouter);
router.use("/trend", trendRouter);
router.use("/correlate", correlateRouter);
router.use("/distribution", distributionRouter);

export default router; 