import 'reflect-metadata';
import {Table, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, } from 'typeorm'
@Table()
export default class Store {
	@PrimaryGeneratedColumn()
	public id?: number

}
