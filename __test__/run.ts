import { Resolvers } from "../src/resolvers";
import { graphql, Source } from "graphql";
import { buildSchema } from "type-graphql";
export const runQuery = async (query: string, variables: any, ctx = {}) => {
  const schema = await buildSchema({
    resolvers: Resolvers,
    emitSchemaFile: true,
  });
  return graphql(schema, query, null, {}, variables);
};
