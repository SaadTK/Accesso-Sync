import express from "expersess";
import { protectRoute } from "../middleware/auth.middleware";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();
router.get("/", protectRoute, getCoupon);
router.get("/validate", protectRoute, validateCoupon);

export default router;
