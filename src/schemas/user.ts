import { Field, ObjectType, InputType, ID } from "type-graphql";

@ObjectType()
export class LoginResponse {
  @Field((type) => ID) userId: string;
  @Field() accessToken: string;
}

@ObjectType()
export class User {
  @Field((type) => ID, { nullable: true, description: "_id" }) id?: string;
  @Field() name: string;
  @Field() password: string;
  @Field() phone: string;
  @Field() role: string;
}

@InputType()
export class UserInput implements Partial<User> {
  @Field() name: string;
  @Field() password: string;
  @Field((type) => String, { nullable: true }) phone: string;
}
