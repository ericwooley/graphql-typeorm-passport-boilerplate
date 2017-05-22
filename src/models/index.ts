import "reflect-metadata"
import { createConnection, Connection, Repository } from "typeorm"
import User from './user'
import ShoppingList from './shoppingList'
import Item from './item'
import Store from './store'
import StoreItemLocation from './storeItemLocation'
import {memoize} from 'lodash'
import {yellow, red} from 'chalk'
export let connection: Connection

export async function getConnection (
	driver = {
		type: "sqlite",
		storage: 'devDatabase.db'
	},
	enableLogging = true
) {
	if(!connection || !connection.isConnected) {
		connection = await createConnection({
			logging: {
				logger: (type, message) => {
					if (!enableLogging) return;
					if(type === 'log') {
						console.log(yellow(message))
					} else {
						console.log(red(message))
					}
				},
				logQueries: true
			},
			driver: (driver as any),
			entities: [
				Item,
				User,
				ShoppingList,
				StoreItemLocation,
				Store
			],
			autoSchemaSync: true,
		})
	}
	return connection
}

export function closeDBConnection () {
	connection && connection.isConnected && connection.close()
}
