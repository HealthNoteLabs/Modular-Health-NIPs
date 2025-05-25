import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "HealthNote API" });
});

app.listen(PORT, () => {
  console.log(`HealthNote API listening on port ${PORT}`);
}); 