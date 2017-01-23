import 'reflect-metadata';
import {Table, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, } from 'typeorm'
@Table()
export default class StoreLocationItem {
	@PrimaryGeneratedColumn()
	public id?: number

}
