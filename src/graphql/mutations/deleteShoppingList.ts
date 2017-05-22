import {Request} from 'express'
import List from '../../models/shoppingList'
import User from '../../models/user'
import {connection} from '../../models/index'

export default async function (object: any, {listId}: {listId: number}, request: Request) {
	const shoppingListRepo = connection.getRepository(List)
	const shoppingList = await shoppingListRepo.findOne({
		id: listId,
		owner: request.user.id
	})

	if (!shoppingList) {
		throw new Error('List could not be found.')
	}

	await shoppingListRepo.remove([shoppingList])
	
	return shoppingList
}
