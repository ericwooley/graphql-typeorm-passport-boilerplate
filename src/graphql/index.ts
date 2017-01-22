import { join } from 'path'
import { readFileSync } from 'fs'
import mutations from './mutations'
import queries from './queries'
export default {
	...queries,
	...mutations,
}
export const schema = readFileSync(join(__dirname, './schema.gql')).toString()
