import {Request} from 'express'
import ShoppingList from '../../models/shoppingList'
import {connection} from '../../models'

export default async function shoppingLists (_: any, args: any, request: Request) {
	const listRepo = connection.getRepository(ShoppingList)
    const lists = await listRepo.find()
	return lists
}
