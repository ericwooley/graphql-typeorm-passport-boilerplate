import {getConnection, closeDBConnection} from '../models'
import * as shelljs from 'shelljs'
import * as os from 'os'
import {Connection} from 'typeorm'
import {join} from 'path'
export default async function loadTestDB(dbName: string, enableLogger = false) {
	const tempDir = os.tmpdir()
	const testDBLocation = join(__dirname, '../../testDatabases', dbName + '.db')
	shelljs.cp(testDBLocation, tempDir)
	const storage = join(tempDir,  dbName +'.db')
	closeDBConnection()
	return new Promise<Connection>(async (resolve) => {
		setTimeout(async () => {
			const connection = await getConnection({type: 'sqlite', storage: storage}, enableLogger)
			resolve(connection)
		}, 10)
	})
}
