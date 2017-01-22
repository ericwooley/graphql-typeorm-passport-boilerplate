import * as passport from 'passport';
import { Express, Response, Request } from 'express'
let LocalStrategy = require('passport-local').Strategy;
import { getConnection } from './models'
import User from './models/user'
import * as bcrypt from 'bcrypt'
export default async function setupPassport(server: Express) {
	const userRepo = (await getConnection()).getRepository(User)
	passport.use('local', new LocalStrategy(
		async function (username: string, password: string, done: Function) {

			const searchUser = new User()
			searchUser.username = username
			const user = await userRepo.findOne(searchUser)
			if (!user) {
				done(null, false, { message: 'Could not find that user' })
			} else {
				const passwordIsCorrect = await bcrypt.compare(password, user.password + '')
				if (passwordIsCorrect) {
					setTimeout(() => done(null, user), Math.floor(Math.random() * 20))
				} else {
					setTimeout(() => done(null, false, { message: 'Incorrect password' }), Math.floor(Math.random() * 20))
				}
			}
		}));
	passport.serializeUser(function (user: User, done: Function) {
		done(null, user.id);
	});
	passport.deserializeUser(async function (id: number, done) {
		const user = await userRepo.findOneById(id)
		if (user) {
			done(null, user)
		} else {
			done(new Error('User auth error'), {})
		}
	});
	server.use(passport.initialize())
	server.use(passport.session())

	server.get('/login', loginForm)
	server.get('/login-failure', loginFailure)
	server.post('/login',
		passport.authenticate('local', {
			failureRedirect: '/login',
			failureFlash: true
		}),
		loginSuccess
	)
	server.post('/register', registerUser)
	function loginFailure(req: Request, response: Response) {
		response.statusCode = 403
		response.setHeader('Content-Type', 'application/json')
		response.send(JSON.stringify({
			errors: [
				{ message: 'Login failure' }
			]
		}))
		response.end()
	}
	server.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/login');
	});
	async function registerUser(req: Request, response: Response) {
		const {username, password} = req.body
		const dupUser = await userRepo.findOne({ username })
		response.setHeader('Content-Type', 'application/json')
		if (dupUser) {
			response.statusCode = 403
			response.send(JSON.stringify('User already exists'))
		} else {
			const hashedPassword = await hashPassword(password)

			const newUser = new User()
			newUser.username = username
			newUser.password = hashedPassword
			const createdUser: User = await userRepo.persist(newUser)
			response.send(JSON.stringify(createdUser.toJSON()))
		}

	}
	async function hashPassword(password: string, saltRounds: number = 10) {
		return await bcrypt.hash(password, saltRounds);
	}
	function loginSuccess(req: Request, response: Response) {
		response.redirect('/graphql')
	}
	function loginForm(req: Request, response: Response) {
		if (req.user && req.user.id) {
			response.send(`
			You are logged in as
			<pre>${JSON.stringify(req.user, null, 6)}</pre>
			<a href='/logout'>logout?</a>
			`)
		} else {
			response.send(`
				<html>
				<body>
					<div style="width: 100%">${req.flash('error')}</div>
					<form style="float: left" action="/login" method="post">
						<h3>Login</h3>
						<div>
							<label>Username:</label>
							<input type="text" name="username"/>
						</div>
						<div>
							<label>Password:</label>
							<input type="password" name="password"/>
						</div>
						<div>
							<input type="submit" value="Log In"/>
						</div>
					</form>
					<form style="float: left" action="/register" method="post">
						<h3>register</h3>
						<div>
							<label>Username:</label>
							<input type="text" name="username"/>
						</div>
						<div>
							<label>Password:</label>
							<input type="password" name="password"/>
						</div>
						<div>
							<input type="submit" value="Log In"/>
						</div>
					</form>
				</body>
				</html>
				`)
		}

		response.end()
	}

	return server
}
