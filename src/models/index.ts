import "reflect-metadata"
import { createConnection, Connection, Repository } from "typeorm"
import User from './user'
let connection: Connection
export async function getConnection () {
	if(!connection) {
		connection = await createConnection({
			driver: {
				type: "sqlite",
				storage: 'testDatabase.db'
			},
			entities: [
				User
			],
			autoSchemaSync: true,
		})
	}
	return connection
}

