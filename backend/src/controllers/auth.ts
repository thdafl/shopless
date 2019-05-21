import url from 'url'
import jwt from 'jsonwebtoken'
import express, {Request, Response, NextFunction} from 'express'
import firebaseAdmin from 'firebase-admin'

declare global {
  namespace Express {
    interface Request {
      token?: string,
      socketId?: string
    }
  }
}

// check if Token exists on request Header and attach token to request as attribute
const validator: ({required}: {required: boolean}) => express.RequestHandler = 
  ({required = false} = {required: false}) => (req, res, next) => {
    if(!!req.user) {next()}
  };

// check if Token exists on request Header and attach token to request as attribute
export const required = validator({required: true})
export const optional = validator({required: false})

export const success = (req: Request, res: Response, next: NextFunction) => {
  jwt.sign({userId: req.user.id}, process.env.SESSION_SECRET as string, {expiresIn:'1 day'}, (err, token) => {
    if(err){
        res.sendStatus(500);
    } else {
      res.cookie('shopless-token', token)
      try {
        const {state} = req.query
        const {returnTo} = JSON.parse(Buffer.from(state, 'base64').toString())
        if (typeof returnTo === 'string' && returnTo.startsWith('http')) {
            res.redirect(returnTo)
        }
      } catch {
        // TODO: return a refresh token also
        if (req.session) {
          const io = req.app.get('io')
          io.in(req.session.socketId).emit('jwt', {token})
          res.redirect(url.format({query: {token}}))
          res.end()
        }
        res.json({token})
      }
    }
});
}
