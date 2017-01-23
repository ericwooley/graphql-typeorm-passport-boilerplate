import { join } from 'path'
import { readFileSync } from 'fs'
import {
	graphql,
	buildSchema
} from 'graphql'
import * as graphqlHTTP from 'express-graphql'
import mutations from './mutations'
import queries from './queries'
export const rootValue = {
	...queries,
	...mutations,
}
export const schema = buildSchema(readFileSync(join(__dirname, './schema.gql')).toString())
export default function buildGraphQLRouteHandler () {
	return  graphqlHTTP({
		schema,
		rootValue,
		graphiql: true
	})
}
