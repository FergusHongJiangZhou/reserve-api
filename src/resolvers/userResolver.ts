import {
  Query,
  Resolver,
  Mutation,
  Arg,
  UseMiddleware,
  Ctx,
} from "type-graphql";
import { User, UserInput, LoginResponse } from "../schemas/user";
import { UserModel, UserDocument } from "../models/user";
import * as bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { isAuth, MyContext } from "../authorized/auth";
import { UserRoleEnum } from "../models/types";

const SECRET_KEY = process.env.SECRET_KEY || `jinwei`;

@Resolver((of) => User)
export class UserResolver {
  @Query(() => User)
  @UseMiddleware(isAuth)
  async getUserById(@Arg("Id") id: String, @Ctx() { payload }: MyContext) {
    const user = payload!.user;
    if (
      user.role === UserRoleEnum.ADMIN
    ) {
      return UserModel.findById(id);
    } else {
      return UserModel.findById(user.id);
    }
  }

  @Query(() => [User], { nullable: true })
  async getUsers(): Promise<User[]> {
    return UserModel.find();
  }

  @Mutation(() => User)
  async addUser(
    @Arg("UserInput") { name, password, phone }: UserInput
  ): Promise<User> {
    let oldUser: UserDocument | null = await UserModel.findOne({ name });
    if (oldUser) {
      throw new Error("user name duplicate");
    }
    let user: UserDocument = new UserModel({ name, password, phone });
    return user.save();
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("UserInput") { name, password }: UserInput
  ): Promise<LoginResponse> {
    const user = await UserModel.findOne({ name });
    if (!user) {
      throw new Error("Can't find user");
    }
    const verify = bcryptjs.compareSync(password, user.password);
    if (!verify) {
      throw new Error("Bad password");
    }

    return {
      userId: user.id,
      accessToken: jwt.sign(
        {
          userId: user.id,
        },
        SECRET_KEY,
        {
          expiresIn: "1d",
        }
      ),
    };
  }
}
