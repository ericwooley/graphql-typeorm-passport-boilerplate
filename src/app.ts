// APP entry point.
import { Request, Response } from 'express'
import getServer from './server'
import buildGraphQLRouteHandler from './graphql'
import {getConnection} from './models'
import {Connection} from 'typeorm'
import {graphiqlExpress } from 'graphql-server-express';
export default async function startServer ({isDev = false, isTest = false}, dbConnection?: Connection) {
	const connection = dbConnection || await getConnection()
	const app = await getServer(connection)
	// Adds Enviornment variables from .enviornment
	const env = (isDev && 'development') || (isTest && 'test') || 'production'
	function authenticatedOnly (request: Request, response: Response, next: Function) {
		if (!request.user) {
			response.statusCode = 403
			response.redirect('/login')
		} else {
			next()
		}
	}
	
	app.use('/graphql', authenticatedOnly, buildGraphQLRouteHandler());
	app.use('/graphiql', authenticatedOnly, graphiqlExpress({endpointURL: '/graphql'}))
	app.use('/', (request, response) => {
		response.redirect('/login')
	})
	return app
}
