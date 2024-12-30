import express from "express";
const router = express.Router();
import { Request, Response, NextFunction } from "express";

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here");
});

export = router;
