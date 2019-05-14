// @ts-ignore
require('dotenv').config()

import os from 'os'
import cluster from 'cluster'
import path from 'path'
import fs from 'fs'
import http from 'http'
import https from 'https'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import cors from 'cors'
import socketio from 'socket.io'

import {PORT, CLIENT_ORIGIN} from './config'
import initPassport from './passport'
import app from './app'

import authRouter from './routers/auth'

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
  
  // Passport and JSON
  app.use(express.json())
  app.use(passport.initialize())
  initPassport()

  // CORS
  app.use(cors({origin: CLIENT_ORIGIN}))
  app.options('*', cors({origin: CLIENT_ORIGIN}))

  // Session
  if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is missing!')
  }
  app.use(session({ 
    secret: process.env.SESSION_SECRET || '', 
    resave: true, 
    saveUninitialized: true
  }))

  // Socket.io
  const io = socketio(server)
  app.set('io', io)

  // Wakeup
  app.get('/wake-up', (req, res) => res.send('👍'))

  app.use('/', authRouter)

  return server
}

if (process.env.NODE_ENV === 'development') {
  createServer().listen(PORT)
  console.log('> Backend listening at port', PORT)
} else {
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
}
