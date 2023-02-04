import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller";
const router = Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);

export default router;
