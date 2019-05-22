// @ts-ignore
require('dotenv').config()

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
import firebaseAdmin from 'firebase-admin'

import {PORT} from './config'
import createApp from './app'

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT ?
      JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT) :
      require('../firebase-service-account.json')
  ),
  databaseURL: "https://shopless-development.firebaseio.com"
});

useContainer(Container)

createConnection(process.env.ORM_CONFIG ? JSON.parse(process.env.ORM_CONFIG) : require('../ormconfig.json')).then(async connection => {
    process.on('SIGTERM', () => {
      console.info('SIGTERM signal received.')
      return connection.close()
    });

    // console.log("Inserting a new user into the database...");
    // const user = new User();
    // user.firstName = "Timber";
    // user.lastName = "Saw";
    // user.age = 25;
    // await connection.manager.save(user);
    // console.log("Saved a new user with id: " + user.id);

    // console.log("Loading users from the database...");
    // const users = await connection.manager.find(User);
    // console.log("Loaded users: ", users);

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
