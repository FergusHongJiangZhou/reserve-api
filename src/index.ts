import "dotenv/config";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema } from "type-graphql";
import { Resolvers } from "./resolvers";
import mongoose from "mongoose";

(async () => {
  const MONGODB_URL =
    process.env.MONGODB_URL ||
    `mongodb://docker:mongopw@localhost:55000/test?authSource=admin`;
  await mongoose.connect(MONGODB_URL),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  const schema = await buildSchema({
    resolvers: Resolvers,
    emitSchemaFile: true,
  });

  const app = Express();

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true
  };

  server.applyMiddleware({ app, cors: corsOptions, path: "/graphql" });

  app.listen(4000, () =>
    console.log("Server is running on http://localhost:4000/graphql")
  );
})();
