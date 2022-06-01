import mongoose, { Schema, Model, Document, ObjectId } from "mongoose";
import { UserDocument } from "../models/user";
import { ReservationStatusEnum } from "./types";

const ObjectId = Schema.Types.ObjectId;

export interface ReservationDocument extends Document {
  size: number;
  userId: string;
  reservedAt: Date;
  status: ReservationStatusEnum;
  user: UserDocument;
}

const ReservationSchema = new Schema(
  {
    size: { type: Number, require: true },
    userId: {
      type: ObjectId,
      require: true,
      ref: "User",
    },
    reservedAt: { type: Date, require: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(ReservationStatusEnum),
      default: ReservationStatusEnum.ACTIVE,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc: any, result: any) {
        result.id = result._id;
        delete result._id;
        delete result.__v;
        delete result.createdAt;
        delete result.updatedAt;
        return result;
      },
    },
  }
);

interface IReservation<T extends Document> extends Model<T> {}

export const ReservationModel: IReservation<ReservationDocument> =
  mongoose.model<ReservationDocument, IReservation<ReservationDocument>>(
    "Reservation",
    ReservationSchema
  );
