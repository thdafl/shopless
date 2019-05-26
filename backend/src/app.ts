import jwt from 'jsonwebtoken'
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'
import createFileStore from 'session-file-store'
import passport from 'passport'
import cors from 'cors'
import {ApolloServer, AuthenticationError} from 'apollo-server-express'

import {PORT, CLIENT_ORIGIN} from './config'
import initPassport from './passport'
import createSchema from './graphql'
import authRouter from './routers/auth'
import { getRepository } from 'typeorm';
import { User } from './entity';
import { reject } from 'q';

async function createApp() {
  const app = express()

  app.use(express.json())
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: false }));

  // Session
  if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is missing!')
  }
  const FileStore = createFileStore(session)
  app.use(session({ 
    secret: process.env.SESSION_SECRET as string,
    store: new FileStore({
      path: './session-store'
    }),
    name: 'shopless-session',
    resave: true, 
    saveUninitialized: true
  }))

  // Passport
  app.use(passport.initialize())
  app.use(passport.session())
  initPassport()

  // CORS
  app.use(cors({origin: CLIENT_ORIGIN, credentials: true}))
  app.options('*', cors({origin: CLIENT_ORIGIN, credentials: true}))

  app.use(async (req, res, next) => {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    let token = bearerHeader ? bearerHeader.split(' ')[1] : req.cookies ? req.cookies['shopless-token'] : undefined

    if (process.env.NODE_ENV === 'development') {
      const referer = req.headers.referer
      if (referer && referer.endsWith('/graphql')) {
        token = await new Promise(resolve => {
          jwt.sign({userId: 'c343b1e3-fc5a-4315-9f45-6017300c7ca9'}, process.env.SESSION_SECRET as string, {expiresIn:'1 day'}, (err, token) => {resolve(token)})
        })
      }
    }

    if (token) {
      // Verify it
      await new Promise((resolve) => {
        jwt.verify(token as string, process.env.SESSION_SECRET as string, async (err, authData) => {
          if (!err) {
            req.token = token
            req.user = await getRepository(User).findOne((authData as any).userId)
            resolve()
          }
          reject(err)
        })
      })
    }
    next()
  })

  // Wakeup
  app.get('/wake-up', (req, res) => res.send('👍'))

  app.use('/', authRouter)

  const graphql = new ApolloServer({
    schema: (await createSchema()),
    context: c => c,
    playground: process.env.NODE_ENV === 'development',
  })
  graphql.applyMiddleware({app, cors: false, bodyParserConfig: false})
  return app
}

export default createApp
