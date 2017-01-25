import {Request} from 'express'
import List from '../../models/shoppingList'
import User from '../../models/user'
import {connection} from '../../models/index'
export default async function (object: any, {name}: {name: string}, request: Request) {
	const userRepo = connection.getRepository(User)
	let user = await userRepo.findOneById(request.user.id)
	if (!user) {
		throw new Error('Authenticated user could not be found')
	}
	const shoppingListRepo = connection.getRepository(List)
	let shoppingList = new List()
	shoppingList.name = name
	shoppingList.owner = Promise.resolve(user)
	shoppingList = await shoppingListRepo.persist(shoppingList)
	return shoppingList
}
