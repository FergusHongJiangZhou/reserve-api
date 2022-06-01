import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { UserModel } from "../models/user";
import { User } from "../schemas/user";
import { Request, Response } from "express";

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { userId: string, user: User};
}
const SECRET_KEY = process.env.SECRET_KEY || `jinwei`;

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("Not authenticated");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, SECRET_KEY);
    const user = await UserModel.findById(payload["userId"]);
    context.payload = {...payload as any, user};
  } catch (err) {
    console.log(err);
    throw new Error("Not authenticated");
  }
  return next();
};
