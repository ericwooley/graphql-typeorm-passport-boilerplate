import * as session from 'express-session'
import * as express from 'express'
import * as pp from 'passport';
var flash = require('connect-flash')
import * as uuid from 'node-uuid'
import setupPassport from './auth'
import * as bodyParser from 'body-parser'
import * as connectRedis from 'connect-redis'
import {Connection} from 'typeorm'
import {red} from 'chalk'
import * as cors from 'cors'
const RedisStore = connectRedis(session)
export default async function getServer (connection: Connection, isDev = false) {
	let server = express()
	if (isDev) {
		const corsOptions = {
			origin: function(origin: string, callback: Function){
				// var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
				callback(null, true);
			},
			credentials: true
		};
		server.use(cors(corsOptions));
	}
	server.use(session({
		secret: 'asdfasdfs',
		genid: function (req) {
			return uuid.v4();
		},
		store: new RedisStore({})
	}))
	server.use(bodyParser.urlencoded({
		extended: true
	}))
	server.use(bodyParser.json());
	server.use(flash())
	server = await setupPassport(server, connection)
	return server
}
