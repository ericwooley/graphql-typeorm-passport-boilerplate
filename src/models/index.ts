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

