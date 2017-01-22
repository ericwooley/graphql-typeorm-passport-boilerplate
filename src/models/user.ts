import {Table, PrimaryGeneratedColumn, Column} from 'typeorm'

@Table()
export default class User {
	@PrimaryGeneratedColumn()
	public id?: number

	@Column()
	public username?: string

	@Column()
	public password?: string

	toJSON() {
		return {
			id: this.id,
			username: this.username
		}
	}
}
