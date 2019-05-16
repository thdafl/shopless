
import express from 'express'
import passport from 'passport'

import * as auth from '../controllers/auth'

const router = express.Router()

const authWith: (passport: (config: Partial<passport.AuthenticateOptions>) => any) => express.RequestHandler =
  passport => (req, res, next) => {
    const {returnTo} = req.query
    const state = returnTo
        ? Buffer.from(JSON.stringify({returnTo})).toString('base64') : undefined
    passport({state})(req, res, next)
  }

// Passport middlewares
const googlePassport = (config: Partial<passport.AuthenticateOptions>) => passport.authenticate('google', {scope: [
  "email",
  "profile",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets"
], ...config})

router.use(auth.optional)

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

export default router
