// APP entry point.
import { join } from 'path'
import * as chalk from 'chalk'
import * as graphqlHTTP from 'express-graphql'
import {
	// graphql,
	buildSchema
} from 'graphql'
import { Request } from 'express'
import getServer from './server'
import rootValue, {schema as graphqlSchema} from './graphql'
import { readFileSync } from 'fs'
(async function () {
	const server = await getServer()
	// Adds Enviornment variables from .enviornment
	require('dotenv').config({ path: join(__dirname, '../.enviornment') });
	const env = process.env.NODE_ENV || 'production'
	// const isdev = env === 'dev'
	const schema = buildSchema(graphqlSchema)

	server.use('/graphql', (request, response, next) => {
		if (!request.user) {
			response.statusCode = 403
			response.redirect('/login')
		} else {
			next()
		}
	}, graphqlHTTP({
		schema,
		rootValue,
		graphiql: true
	}));
	try {
		const port = process.env.PORT || 80
		console.log(chalk.blue(`Starting ${env} server on port ${port}: http://localhost:${port}`))
		server.listen(port);
		console.log(chalk.blue(`Server started, http://localhost:${port}/graphql`))
	} catch (e) {
		console.error(chalk.red('could not start server'))
		console.error(chalk.red(e.message))
	}
})()
