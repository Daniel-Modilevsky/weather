import { Router, Request, Response } from "express";
import {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
} from "../controllers/alerts";
import { AlertInput } from "../types/alert";

const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
  const alerts = getAlerts();
  res.json(alerts);
});

router.post("/", (req: Request, res: Response) => {
  try {
    const input: AlertInput = req.body;
    const newAlert = createAlert(input);
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

export default router;
