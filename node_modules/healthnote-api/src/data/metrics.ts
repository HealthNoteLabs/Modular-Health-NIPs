export interface MetricMeta {
  metric: string;
  kind: number;
  canonical_unit: string;
  optional_tags: string[];
  consent_default: "aggregate-only" | "public" | "private";
  ethos: string;
}

const metrics: MetricMeta[] = [
  {
    metric: "weight",
    kind: 1351,
    canonical_unit: "kg",
    optional_tags: ["converted_value", "timestamp", "accuracy"],
    consent_default: "aggregate-only",
    ethos: "Encrypt by default; share only derived stats.",
  },
  {
    metric: "height",
    kind: 1352,
    canonical_unit: "cm",
    optional_tags: ["converted_value", "timestamp", "accuracy"],
    consent_default: "aggregate-only",
    ethos: "Convert imperial to cm; encrypt if sensitive.",
  },
  {
    metric: "age",
    kind: 1353,
    canonical_unit: "years",
    optional_tags: ["timestamp", "dob", "accuracy"],
    consent_default: "aggregate-only",
    ethos: "DOB optional; respect privacy.",
  },
  // ... add more metrics as needed
];

export default metrics; 