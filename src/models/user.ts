import 'reflect-metadata';
import {Table, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, } from 'typeorm'
import ShoppingList from './shoppingList'
import * as bcrypt from 'bcrypt'

@Table()
export default class User {
	@PrimaryGeneratedColumn()
	public id?: number

	@Column()
	public username: string

	@Column()
	password: string
	setPassword(pw: string) {
		this.password = pw
	}

	async validatePassword(plainTextPassword: string) {
		return await bcrypt.compare(plainTextPassword, this.password + '')
	}

	@OneToMany(type => ShoppingList, shoppingList => shoppingList.owner)
	lists: Promise<ShoppingList[]>

	toJSON() {
		return {
			id: this.id,
			username: this.username
		}
	}
}
