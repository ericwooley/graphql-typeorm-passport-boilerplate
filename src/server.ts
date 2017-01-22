import * as session from 'express-session'
import * as express from 'express'
import * as pp from 'passport';
var flash = require('connect-flash')
import * as uuid from 'node-uuid'
import setupPassport from './auth'
import * as bodyParser from 'body-parser'
import * as connectRedis from 'connect-redis'
const RedisStore = connectRedis(session)
export default async function getServer () {
	let server = express()
	server.use(session({
		secret: 'asdfasdfs',
		genid: function (req) {
			return uuid.v4();
		},
		store: new RedisStore({})
	}))
	server.use(bodyParser());
	server.use(flash())
	server = await setupPassport(server)
	return server
}
