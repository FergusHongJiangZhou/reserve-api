import mongoose, { Schema, Model, Document } from "mongoose";
import * as bcryptjs from "bcryptjs";
import { UserRoleEnum } from "./types";

export interface UserDocument extends Document {
  name: string;
  password: string;
  role: UserRoleEnum;
  phone: string;
}

const UserSchema: Schema<UserDocument> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name can not be null!"],
      trim: true,
    },
    password: String,
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRoleEnum),
      default: UserRoleEnum.GUEST,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc: any, result: any) {
        result.id = result._id;
        delete result._id;
        delete result.__v;
        delete result.password;
        delete result.createdAt;
        delete result.updatedAt;
        return result;
      },
    },
  }
);

UserSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcryptjs.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

interface IUser<T extends Document> extends Model<T> {}

export const UserModel: IUser<UserDocument> = mongoose.model<
  UserDocument,
  IUser<UserDocument>
>("User", UserSchema);
