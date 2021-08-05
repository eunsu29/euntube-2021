import express from "express";
import {
  edit,
  logout,
  see,
  callGithubLogin,
  callbackGithubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/github/call", callGithubLogin);
userRouter.get("/github/callback", callbackGithubLogin);
userRouter.get("/edit", edit);
userRouter.get(":id", see);

export default userRouter;
