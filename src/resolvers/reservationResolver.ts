import {
  Query,
  Resolver,
  Mutation,
  Arg,
  FieldResolver,
  ResolverInterface,
  Root,
  UseMiddleware,
  Ctx,
} from "type-graphql";
import { Reservation, ReservationInput } from "../schemas/reservation";
import { ReservationModel, ReservationDocument } from "../models/reservation";
import { User } from "../schemas/user";
import { UserModel } from "../models/user";
import { isAuth, MyContext } from "../authorized/auth";
import { UserRoleEnum } from "../models/types";

@Resolver((of) => Reservation)
export class ReservationResolver implements ResolverInterface<Reservation> {
  @FieldResolver(() => User)
  async user(@Root() parent: ReservationDocument) {
    return UserModel.findById(parent.userId);
  }

  @Query(() => [Reservation], { nullable: true })
  @UseMiddleware(isAuth)
  async getReservations(@Ctx() { payload }: MyContext): Promise<Reservation[]> {
    const user = payload!.user;
    if (user.role !== UserRoleEnum.ADMIN) {
      return ReservationModel.find({ userId: user.id });
    }
    return ReservationModel.find();
  }

  @Query(() => Reservation, { nullable: true })
  @UseMiddleware(isAuth)
  async getReservationById(
    @Arg("Id")
    id: string,
    @Ctx() { payload }: MyContext
  ): Promise<Reservation> {
    const user = payload!.user;
    const reservation = await ReservationModel.findById(id);
    if (
      user.role === UserRoleEnum.ADMIN ||
      (user.role !== UserRoleEnum.ADMIN && reservation.userId.toString() === user.id)
    ) {
      return reservation;
    }
    return null;
  }

  @Mutation(() => Reservation)
  @UseMiddleware(isAuth)
  async addReservation(
    @Arg("ReservationInput")
    { userId, size, reservedAt, status }: ReservationInput,
    @Ctx() { payload }: MyContext
  ): Promise<Reservation> {
    const user = payload!.user;
    if (
      user.role === UserRoleEnum.ADMIN ||
      (user.role !== UserRoleEnum.ADMIN && userId === user.id)
    ) {
      const reservation: ReservationDocument = new ReservationModel({
        userId,
        size,
        reservedAt,
        status,
      });
      return reservation.save();
    } else {
      throw new Error("No Permission");
    }
  }

  @Mutation(() => Reservation)
  @UseMiddleware(isAuth)
  async updateReservation(
    @Arg("ReservationInput")
    { id, size, reservedAt, status }: ReservationInput,
    @Ctx() { payload }: MyContext
  ) {
    const user = payload!.user;
    if (user.role === UserRoleEnum.ADMIN) {
      return ReservationModel.findByIdAndUpdate(id, {
        size,
        reservedAt,
        status,
      });
    } else {
      const reservation = await ReservationModel.findById(id);
      if (reservation.userId.toString()=== user.id) {
        return ReservationModel.findByIdAndUpdate(id, {
          size,
          reservedAt,
          status,
        });
      } else {
        throw new Error("No Permission");
      }
    }
  }
}
