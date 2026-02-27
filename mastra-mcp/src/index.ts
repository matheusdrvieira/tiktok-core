import cors from "cors";
import express, { type Request, type Response } from "express";
import { mastra } from './mastra';
import { env } from './shared/config/env';

const app = express();

app.use(cors())
app.use(express.json());

app.get("/ping", (_req: Request, res: Response) => {
  res.json({ message: "pong" });
});

app.post("/quiz/video", async (req: Request, res: Response) => {
  try {
    const workflow = mastra.getWorkflow("quizWorkflow");
    const run = await workflow.createRun();
    const result = await run.start({ inputData: req.body });

    if (result.status !== "success") {
      const message =
        result.status === "failed"
          ? result.error?.message || "Workflow finalizou com erro."
          : `Workflow finalizou com status ${result.status}.`;

      return res.status(500).json({ message });
    }

    return res.status(200).json(result.result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Falha ao executar quiz workflow.";

    return res.status(500).json({ message });
  }
});

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
