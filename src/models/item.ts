import 'reflect-metadata';
import {Table, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, } from 'typeorm'
import ShoppingList from './shoppingList'
@Table()
export default class Item {
	@PrimaryGeneratedColumn()
	public id?: number

	@Column()
	public name: string

	@ManyToOne(type => ShoppingList, shoppingList => shoppingList.items)
	@JoinTable()
	shoppingLists: Promise<ShoppingList>
}
