import { ReservationResolver } from "./reservationResolver";
import { UserResolver } from "./userResolver";

export const Resolvers = [ReservationResolver, UserResolver] as const;