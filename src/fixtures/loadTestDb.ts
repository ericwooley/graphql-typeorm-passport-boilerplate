import {getConnection, closeDBConnection} from '../models'
import * as shelljs from 'shelljs'
import * as os from 'os'
import {join} from 'path'
export default async function loadTestDB(dbName: string, enableLogger = false) {
	const tempDir = os.tmpdir()
	const testDBLocation = join(__dirname, '../../testDatabases', dbName + '.db')
	shelljs.cp(testDBLocation, tempDir)
	const storage = join(tempDir,  dbName +'.db')
	closeDBConnection()
	const connection = await getConnection({type: 'sqlite', storage: storage}, enableLogger)
	return connection
}
