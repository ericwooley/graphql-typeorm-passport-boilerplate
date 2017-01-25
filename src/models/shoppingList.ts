import 'reflect-metadata';
import {Table, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, ManyToMany} from 'typeorm'
import User from './user'
import Item from './item'
@Table()
export default class ShoppingList {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@ManyToMany(type => Item, item => item.shoppingLists)
	@JoinTable()
	items: Promise<Item[]>

	@ManyToOne(type => User, user => user.lists, {
		cascadeAll: true
	})
	owner: Promise<User>
}
