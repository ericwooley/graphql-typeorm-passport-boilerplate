import {Request} from 'express'
import User from '../../models/user'
import {connection} from '../../models'
export default async function user (_: any, args: any, request: Request) {
	if (!request.user) return null
	const userRepo = connection.getRepository(User)
	const user = await userRepo.findOneById(request.user.id
	// ,{
	// 	alias: 'user',
	// 	innerJoinAndSelect: {
    //         "lists": "user.lists"
    //     }
	// }
	)

	if (!user) {
		throw new Error('You are not logged in')
	}
	// OUTPUT
	// executing query:
	// SELECT "lists"."id" AS "lists_id", "lists"."name" AS "lists_name", "lists"."owner" AS "lists_owner" FROM "shopping_list" "lists"
	// 		INNER JOIN
	// "user" "User" ON "User"."id"="lists"."owner"
	// WHERE "lists"."id"=$1 -- PARAMETERS: [1]
	// ^^^^^^ extra where clause being added.
	const lists = await user.lists
	console.log(lists)
	delete user.password
	return user
}
