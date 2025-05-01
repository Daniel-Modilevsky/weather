import { Router, Request, Response } from "express";
import {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  checkAllAlerts,
} from "../controllers/alerts";

const router: Router = Router();

const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<any>) =>
  (req: Request, res: Response) => {
    Promise.resolve(fn(req, res)).catch((error) => {
      res.status(500).json({ error: error.message });
    });
  };

router.get("/", asyncHandler(getAlerts));

router.post("/", asyncHandler(createAlert));

router.put("/:id", asyncHandler(updateAlert));

router.delete("/:id", asyncHandler(deleteAlert));

router.post("/check-all", asyncHandler(checkAllAlerts));

export default router;
