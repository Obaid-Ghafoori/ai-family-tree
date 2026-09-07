import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ai-family-tree-api" });
});

app.post("/api/research/ancestors", (req, res) => {
  const person = req.body?.person;
  if (!person?.name) {
    return res.status(400).json({ error: "person.name is required" });
  }

  // Deliberately mocked. Real genealogy research must be backed by
  // connected, permitted sources and must return source-level evidence.
  return res.json({
    mode: "demo",
    findings: [{
      candidate: {
        id: "demo-candidate-1",
        name: "Possible ancestor",
        birthYear: undefined
      },
      relationship: "BIOLOGICAL_PARENT",
      confidence: 0,
      explanation:
        "Demo only. No real ancestor relationship has been established. Connect verified genealogy sources before using research results.",
      evidence: []
    }]
  });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`AI Family Tree API listening on http://localhost:${port}`);
});
