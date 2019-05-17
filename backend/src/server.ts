// @ts-ignore
require('dotenv').config()

import os from 'os'
import cluster from 'cluster'
import path from 'path'
import fs from 'fs'
import http from 'http'
import https from 'https'
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'
import createFileStore from 'session-file-store'
import passport from 'passport'
import cors from 'cors'
import socketio from 'socket.io'
import firebaseAdmin from 'firebase-admin'

import {PORT, CLIENT_ORIGIN} from './config'
import initPassport from './passport'
import app from './app'

import authRouter from './routers/auth'

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT ?
      JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT) :
      require('../firebase-service-account.json')
  ),
  databaseURL: "https://shopless-development.firebaseio.com"
});

function createServer() {
  let server: http.Server
  
  if (process.env.NODE_ENV === 'production') {
    server = http.createServer(app)
  }
  // We are not in production so load up our certificates to be able to 
  // run the server in https mode locally
  else {
    const certOptions = {
      key: fs.readFileSync(path.resolve('local-certs/server.key')),
      cert: fs.readFileSync(path.resolve('local-certs/server.crt'))
    }
    server = https.createServer(certOptions, app)
  }

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

  // Socket.io
  const io = socketio(server)
  app.set('io', io)

  // Passport
  app.use(passport.initialize())
  // app.use(passport.session())
  initPassport()

  // CORS
  app.use(cors({origin: CLIENT_ORIGIN, credentials: true}))
  app.options('*', cors({origin: CLIENT_ORIGIN, credentials: true}))

  // Wakeup
  app.get('/wake-up', (req, res) => res.send('👍'))

  app.use('/', authRouter)

  return server
}

if (true/*process.env.NODE_ENV === 'development'*/) {
  createServer().listen(PORT)
  console.log('> Backend listening at port', PORT)
}/* else {
  if (cluster.isMaster) {
    console.log(`Master started with pid ${process.pid}`)
  
    const cpuCount = os.cpus().length
    for (let i = 0; i < cpuCount - 1; ++i) { cluster.fork() }
  
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`)
      cluster.fork()
    })
  } else {
    const server = createServer()
    server.listen(PORT)
  
    console.log(`Worker started with pid ${process.pid}`)
  }
  console.log('> Backend listening at port', PORT)
}(*/
