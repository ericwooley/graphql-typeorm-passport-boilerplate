// APP entry point.
import { Request } from 'express'
import getServer from './server'
import buildGraphQLRouteHandler from './graphql'
import {getConnection} from './models'
import {Connection} from 'typeorm'
export default async function startServer ({isDev = false, isTest = false}, dbConnection?: Connection) {
	const connection = dbConnection || await getConnection()
	const app = await getServer(connection)
	// Adds Enviornment variables from .enviornment
	const env = (isDev && 'development') || (isTest && 'test') || 'production'
	app.use('/graphql', (request, response, next) => {
		if (!request.user) {
			response.statusCode = 403
			response.redirect('/login')
		} else {
			next()
		}
	}, buildGraphQLRouteHandler());
	return app
}
