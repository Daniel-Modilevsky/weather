import { Router, Request, Response } from "express";
import {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
} from "../controllers/alerts";
import { AlertInputSchema } from "../schemas/alert";
import { alertCheckProducer } from "../queues/alertProducer";

const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
  const alerts = getAlerts();
  res.json(alerts);
});

router.post("/", (req: Request, res: Response) => {
  try {
    const parsed = AlertInputSchema.parse(req.body);
    const newAlert = createAlert(parsed);
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(400).json({ error: "Invalid alert data" });
  }
});

router.put("/:id", (req: any, res: any) => {
  const { id } = req.params;
  const updated = updateAlert(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Alert not found" });
  }
  res.json(updated);
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = deleteAlert(id);
  res.json({ success: deleted });
});

router.post("/check-all", async (_req: Request, res: Response) => {
  const alerts = getAlerts();
  let published = 0;
  let failed = 0;

  for (const alert of alerts) {
    try {
      await alertCheckProducer.publish(alert);
      published++;
    } catch (err) {
      console.error(`Failed to enqueue alert ${alert.id}`, err);
      failed++;
    }
  }

  res.json({
    total: alerts.length,
    published,
    failed,
  });
});

export default router;
