import 'reflect-metadata';
import {Table, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable} from 'typeorm'
import User from './user'

@Table()
export default class ShoppingList {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@ManyToOne(type => User, user => user.lists, {
		cascadeAll: true
	})
	@JoinTable()
	owner: Promise<User>
}
