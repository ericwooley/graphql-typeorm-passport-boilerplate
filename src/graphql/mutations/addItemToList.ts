import ShoppingList from '../../models/shoppingList'
import Item from '../../models/item'
import {connection} from '../../models/'
import {Request} from 'express'
export default async function addItemToList ({listId, itemId, name}: {listId: number, itemId?: number, name: string}, request: Request) {
	if (itemId !== undefined && name) {
		throw new Error('You can only supply a name, or an item id. Not both.')
	}
	if (itemId === undefined && !name) {
		throw new Error('You must supply a name or an id')
	}
	const slRepo = connection.getRepository(ShoppingList)
	const itemRepo = connection.getRepository(Item)
	const shoppingList = await slRepo.findOneById(listId)
	if(!shoppingList) {
		throw new Error('Shopping list not found')
	}
	const ownerId = (await shoppingList.owner).id
	if (ownerId !== request.user.id) {
		throw new Error('You do not own this list')
	}
	let item: Item = await itemRepo.findOneById(itemId) || await itemRepo.findOne({name}) || new Item()
	if (item.id === undefined) {
		item.name = item.name || name
		console.log('creating new item', item)
		item = await itemRepo.persist(item)
	}
	const oldItems = (await shoppingList.items).filter(oldItem => oldItem.id !== item.id)
	shoppingList.items = Promise.resolve([item, ...oldItems])
	return slRepo.persist(shoppingList)
}
