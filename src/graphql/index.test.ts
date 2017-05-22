import {schema} from './'
import {expect} from 'chai'
import {Express} from 'express'
import createApp from '../app'
import * as request from 'supertest'
import loadTestDb from '../fixtures/loadTestDb'
import {Connection} from 'typeorm'

describe('graphql', () => {
	describe('schema', () => {
		it('should have all required types', () => {
			const requiredTypes = [
				'ShoppingList',
				'Item',
				'User',
				'Query',
				'Mutation'
			].forEach(type =>
				expect(schema.getType(type).toString()).to.equal(type))
		})
	})
	
	describe('queries', () => {
		let app:Express
		let connection: Connection
		beforeEach(async () => {
			connection = await loadTestDb('oneUserOneListOneItem')
			app = await createApp({isTest: true}, connection)
		})
		it('should have a db connection', () => {
			expect(connection.isConnected).to.be.true
		})
	})
})
