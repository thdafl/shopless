import * as io from 'socket.io-client'

export const socket = io(process.env.API_URL as string, {transports: ['websocket'], secure: true})
