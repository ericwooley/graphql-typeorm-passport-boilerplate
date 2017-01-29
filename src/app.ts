// APP entry point.
import { Request, Response } from 'express'
import getServer from './server'
import buildGraphQLRouteHandler from './graphql'
import {getConnection} from './models'
import {Connection} from 'typeorm'
import {graphiqlExpress } from 'graphql-server-express';
export default async function startServer ({isDev = false, isTest = false}, dbConnection?: Connection) {
	const connection = dbConnection || await getConnection()
	const app = await getServer(connection, isDev)


	// Adds Enviornment variables from .enviornment
	const env = (isDev && 'development') || (isTest && 'test') || 'production'
	function authenticatedOnly (request: Request, response: Response, next: Function) {
		if (!request.user) {
			console.log('no user', request.user)
			response.statusCode = 403
			response.send()
		} else {
			next()
		}
	}

	// app.options('/graphql', function (request: Request, response: Response, next: Function) {
	// 	if(isDev) {
	// 		response.header("Access-Control-Allow-Origin", "*");
	// 		response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	// 	}
	// 	response.send()
	// })
	app.use('/graphql', authenticatedOnly, buildGraphQLRouteHandler());
	app.use('/graphiql', authenticatedOnly, graphiqlExpress({endpointURL: '/graphql'}))
	// app.use('/', (request, response) => {
	// 	// response.redirect('/login')
	// })
	return app
}
