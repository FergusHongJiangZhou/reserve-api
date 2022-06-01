import { Field, ObjectType, InputType, ID } from "type-graphql";
import { User } from "../schemas/user";

@ObjectType()
export class Reservation {
  @Field((type) => ID, { nullable: true, description: "_id" }) id?: string;
  @Field() size: Number;
  @Field((type) => ID) userId: string;
  @Field() reservedAt: Date;
  @Field() status: string;
  @Field() user: User;
}

@InputType()
export class ReservationInput implements Partial<Reservation> {
  @Field((type) => ID, { nullable: true, description: "_id" }) id?: string;
  @Field() size: Number;
  @Field((type) => ID, { nullable: true }) userId: string;
  @Field() reservedAt: Date;
  @Field((type) => String, { nullable: true }) status: string;
}
