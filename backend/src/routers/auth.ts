
import express from 'express'
import passport from 'passport'
import { getConnection } from "typeorm";

import * as auth from '../controllers/auth'
import { User } from '../graphql/typeDefs'

const router = express.Router()

const authWith: (passport: (config: Partial<passport.AuthenticateOptions>) => any) => express.RequestHandler =
  passport => (req, res, next) => {
    const {returnTo} = req.query
    const state = returnTo
        ? Buffer.from(JSON.stringify({returnTo})).toString('base64') : undefined
    passport({state})(req, res, next)
  }

const localRegister = async (req: express.Request, res: express.Response) => {
  const connection = await getConnection().getRepository(User)

  const user = new User();
  user.username = req.body.username;
  user.name = req.body.name;
  await user.hashing(req.body.password);

  try {
    const result = await connection.insert(user)
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

const localLogin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  passport.authenticate('local', (error, user, info) => {
    if (!!user) {
      next()
    }
    if (error) {
      res.json({
        message: error,
        success: false
      })
    }
    if (!!info) {
      res.json({
        message: info.message,
        success: false
      })
    }
  }
  )(req, res, next)
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

router.post('/local/login', localLogin, auth.success)
router.post('/local/register', localRegister)

export default router
