import { join } from 'path'
import { readFileSync } from 'fs'
import mutations from './mutations'
import queries from './queries'
import { graphqlExpress } from 'graphql-server-express';
import {makeExecutableSchema} from 'graphql-tools'
import {green} from 'chalk'
export const schema = readFileSync(join(__dirname, './schema.gql')).toString()

export const resolvers = {
	Query: queries,
	Mutation: mutations,
}

export default function buildGraphQLRouteHandler () {
	return graphqlExpress((request) => ({
		schema: makeExecutableSchema({
			typeDefs: schema,
			resolvers
		}),
		context: request,
		logger: (e: string) => console.log('GRAPHQL', green(e))
	}))
}
