import 'reflect-metadata';
import {Table, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, } from 'typeorm'
import ShoppingList from './shoppingList'

@Table()
export default class Item {
	@PrimaryGeneratedColumn()
	public id?: number

	@Column()
	public name: string

	@ManyToMany(type => ShoppingList, shoppingList => shoppingList.items)
	shoppingLists: Promise<ShoppingList>
}
