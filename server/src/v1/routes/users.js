import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
const userRouter = Router();

/* GET users listing. */
userRouter.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

userRouter.post("/login", loginUser);
userRouter.route("/register").post(registerUser);

export default userRouter;
