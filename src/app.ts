// APP entry point.
import { Request, Response } from 'express'
import getServer from './server'
import buildGraphQLRouteHandler from './graphql'
import {getConnection} from './models'
import {Connection} from 'typeorm'
import {graphiqlExpress } from 'graphql-server-express';
import {ensureAuthenticated} from './auth';

export default async function startServer (
	{isDev = false, isTest = false}, dbConnection?: Connection
) {
	const connection = dbConnection || await getConnection()
	const app = await getServer(connection, isDev)

	// Adds Enviornment variables from .enviornment
	const env = (isDev && 'development') || (isTest && 'test') || 'production'

	app.use('/graphql',ensureAuthenticated, buildGraphQLRouteHandler());
	app.use('/graphiql',ensureAuthenticated, graphiqlExpress({endpointURL: '/graphql'}))

	return app
}
