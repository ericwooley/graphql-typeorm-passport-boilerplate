import {Request} from 'express'
import User from '../../models/user'
import {connection} from '../../models'
export default async function user (args: any, request: Request) {
	const userRepo = connection.getRepository(User)
	const user = await userRepo.findOneById(request.user.id)
	if (!user) {
		throw new Error('You are not logged in')
	}
	delete user.password
	return user
}
