// @ts-ignore
require('dotenv').config()
require('dotenv').config({path: require('path').resolve(process.cwd(), '../../.env.default')})
require('dotenv').config({path: require('path').resolve(__dirname, '../../.env')})
require('dotenv').config({path: require('path').resolve(__dirname, '../../.env.default')})

import os from 'os'
import cluster from 'cluster'
import path from 'path'
import fs from 'fs'
import http from 'http'
import https from 'https'
import "reflect-metadata";
import {createConnection, useContainer} from "typeorm";
import {Container} from 'typedi'
import socketio from 'socket.io'

import {PORT} from './config'
import createApp from './app'

const exitHook = require('async-exit-hook')

useContainer(Container)

createConnection({
  ...{
    "type": "postgres",
    "synchronize": true,
    "logging": false,
    "entities": [
       "src/entity/**/*.ts"
    ],
    "migrations": [
       "src/migration/**/*.ts"
    ],
    "subscribers": [
       "src/subscriber/**/*.ts"
    ],
    "cli": {
       "entitiesDir": "src/entity",
       "migrationsDir": "src/migration",
       "subscribersDir": "src/subscriber"
    }
  },
  ...{
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  },
  ...(JSON.parse(process.env.ORM_CONFIG || process.env.DB_CONFIG || '{}'))
}).then(async connection => {
    exitHook(async (callback: any) => {
      await connection.close()
      callback()
    })

    async function createServer() {
      let server: http.Server
      const app = await createApp()
      
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
        server = https.createServer(certOptions, await createApp())
      }

      // Socket.io
      const io = socketio(server)
      app.set('io', io)
      
      return server
    }
    
    if (true/*process.env.NODE_ENV === 'development'*/) {
      (await createServer()).listen(PORT)
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
}).catch(error => console.log(error));
