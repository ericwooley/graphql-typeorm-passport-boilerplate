import createApp from '../app'
import * as request from 'supertest'
import {Express} from 'express'
import loadTestDb from './loadTestDb'
import {expect} from 'chai'
import {Connection} from 'typeorm'

describe.only('loadTestDb', async () => {
	let connection: Connection

	beforeEach(async () => {
		connection = await loadTestDb('oneUserOneListOneItem')
	})

	it('should load the test database', async () => {
		expect(connection).to.exist
	})
	
	it('should have the correct data', async () => {
		const users: any[] = await connection.entityManager.query('select * from user')
		expect(users.length).to.equal(1)
	})
})
