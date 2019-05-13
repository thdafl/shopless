import os from 'os'
import cluster from 'cluster'
import express from 'express'
import cors from 'cors'

import {PORT} from './config'
import app from './app'

function createServer() {
  const server = express()
  
  server.use(cors())
  server.options('*', cors())

  server.use('/', app)
  return server
}

if (process.env.NODE_ENV === 'development') {
  createServer().listen(PORT, (err: Error) => {
    if (err) {
      console.error(err)
      return
    }
  })
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
    server.listen(PORT, (err: Error) => {
      if (err) {
        console.error(err)
        return
      }
    })
  
    console.log(`Worker started with pid ${process.pid}`)
  }
  console.log('> Backend listening at port', PORT)
}
