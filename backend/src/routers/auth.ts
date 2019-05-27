
import express from 'express'
import passport from 'passport'
import { getConnection } from "typeorm";

import * as auth from '../controllers/auth'
import { LocalUser } from '../graphql/typeDefs'

const router = express.Router()

const authWith: (passport: (config: Partial<passport.AuthenticateOptions>) => any) => express.RequestHandler =
  passport => (req, res, next) => {
    const {returnTo} = req.query
    const state = returnTo
        ? Buffer.from(JSON.stringify({returnTo})).toString('base64') : undefined
    passport({state})(req, res, next)
  }

const localRegister = async (req: express.Request, res: express.Response) => {
	const connection = await getConnection().getRepository(LocalUser)

	const localUser = new LocalUser();
	localUser.username = req.body.username;
	localUser.password = req.body.password;
	try {
		const result = await connection.insert(localUser)
		if (!!result) {
			res.json({
				message: "Success",
				success: true
			})
		}
	} catch (err) {
		res.json({
			message: "Error: " + err,
			success: false
		})
	}
}

// Passport middlewares
const googlePassport = (config: Partial<passport.AuthenticateOptions>) => passport.authenticate('google', {scope: [
  "email",
  "profile",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets"
], ...config})

const localPassport = () => passport.authenticate('local')

// This custom middleware allows us to attach the socket id to the session
// With that socket id we can send back the right user info to the right 
// socket
router.use((req, res, next) => {
  if (req.session && req.query.socketId) {
    req.session.socketId = req.query.socketId
  }
  req.socketId = req.socketId || req.query.socketId
  next()
})

// OAuth success callback
router.get('/google/callback', authWith(googlePassport), auth.success)

router.get('/users', auth.required, (req, res) => {res.json({user: req.user})})

router.get('/verify', auth.required)

// Routes that are triggered on the client
router.get('/google', authWith(googlePassport))

router.post('/local/login',authWith(localPassport),auth.success)
router.post('/local/register', localRegister)

export default router
