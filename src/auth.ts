import * as passport from 'passport';
import { Express, Response, Request } from 'express'
import { getConnection } from './models'
import User from './models/user'
import { Connection } from 'typeorm'
import * as bcrypt from 'bcrypt'

let LocalStrategy = require('passport-local').Strategy;

export default async function setupPassport(server: Express, connection: Connection) {
    const userRepo = connection.getRepository(User)

    passport.use('local', new LocalStrategy(
        async function(username: string, password: string, done: Function) {
            const searchUser = new User()
            const user = await userRepo.findOne({ username })

            searchUser.username = username

            if (!user) {
                done(null, false, { message: 'Could not find that user' })
            } else {
                const passwordIsCorrect = await user.validatePassword(password)

                if (passwordIsCorrect) {
                    setTimeout(() => done(null, user.toJSON()), Math.floor(Math.random() * 20))
                } else {
                    setTimeout(() => done(null, false, { message: 'Incorrect password' }), Math.floor(Math.random() * 20))
                }
            }
        }));

    passport.serializeUser(function(user: User, done: Function) {
        done(null, user.id);
    });

    passport.deserializeUser(async function(id: number, done) {
        const user = await userRepo.findOneById(id)
        if (user) {
            done(null, user)
        } else {
            done(null, {})
        }
    });

    server.use(passport.initialize())
    server.use(passport.session())

    server.get('/login-failure', loginFailure)
    server.post('/login', passport.authenticate('local', {
			failureRedirect: '/login',
			successRedirect: '/graphiql'
		})
	)

    server.get('/login', loginForm)
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

    server.get('/logout', function(req, res) {
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
            newUser.setPassword(hashedPassword)

            const createdUser: User = await userRepo.persist(newUser)

            response.send(JSON.stringify(createdUser.toJSON()))
        }
    }

    async function hashPassword(password: string, saltRounds: number = 10) {
        return await bcrypt.hash(password, saltRounds);
    }

    function loginForm(req: Request, response: Response) {
        if (req.user && req.user.id) {
            response.redirect('/graphiql')
        } else {
            response.send(`
				<html>
				<body>
					<div style="width: 100%">Login or Register</div>
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

export function ensureAuthenticated(req: Request, res: Response, next: Function) {
	console.log(req.user)
    if (req.isAuthenticated()) {
        return next();
    }

    res.sendStatus(403);

}
