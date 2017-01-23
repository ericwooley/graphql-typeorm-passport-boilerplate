import createApp from '../../app'
import * as request from 'supertest'
import userQuery from './user'
import {Express} from 'express'
describe('user query', async () => {
	let app:Express
	beforeEach(async () => {
		app = await createApp({isTest: true})
	})

})
