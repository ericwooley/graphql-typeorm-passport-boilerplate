import createApp from '../app'
import * as request from 'supertest'
import {Express} from 'express'
import loadTestDb from './loadTestDb'
import {expect} from 'chai'
import {Connection} from 'typeorm'
describe.only('loadTestDb', async () => {
	// let connection: Connection = await loadTestDb('oneUserOneListOneItem')
	// beforeEach(async () => {
	// 	connection = await loadTestDb('oneUserOneListOneItem')
	// })
	it('should load the test database', async () => {
		const connection: Connection = await loadTestDb('oneUserOneListOneItem')
		expect(connection).to.exist
	})
	it('should have the correct data', async () => {
		const connection: Connection = await loadTestDb('oneUserOneListOneItem')
		const users: any[] = await connection.entityManager.query('select * from user')
		expect(users.length).to.equal(1)
	})
})
