import {Request} from 'express'
import User from '../../models/user'
import {connection} from '../../models'
export default async function user (_: any, args: any, {request}: {request: Request}) {
	const userRepo = connection.getRepository(User)
	const user = await userRepo.findOneById(request.user.id)

	if (!user) {
		throw new Error('You are not logged in')
	}
	console.log('relquesting lists')
	const lists = await user.lists
	console.log(lists)
	delete user.password
	return user
}
