import "reflect-metadata"
import { createConnection, Connection, Repository } from "typeorm"
import User from './user'
import ShoppingList from './shoppingList'
import {memoize} from 'lodash'
import {yellow, red} from 'chalk'
export let connection: Connection
export async function getConnection () {
	if(!connection) {
		connection = await createConnection({
			logging: {
				logger: (type, message) => {
					if(type === 'log') {
						console.log(yellow(message))
					} else {
						console.log(red(message))
					}

				},
				logQueries: true
			},
			driver: {
				type: "sqlite",
				storage: 'testDatabase.db'
			},
			entities: [
				User,
				ShoppingList
			],
			autoSchemaSync: true,
		})
	}
	return connection
}

