import mongoose from "mongoose";
import { UserModel } from "../src/models/user";

export const cleanDB = async () => {
  await UserModel.deleteMany({});
};
export const connectToDB = async () => {
  const MONGODB_URL = `mongodb://docker:mongopw@localhost:55000/jest?authSource=admin`;
  const connection = await mongoose.connect(MONGODB_URL);
  return connection;
};
export const disconnectDB = () => {
  mongoose.disconnect();
};
