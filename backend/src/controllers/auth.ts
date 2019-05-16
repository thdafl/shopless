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
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    const token = bearerHeader ? bearerHeader.split(' ')[1] : req.cookies.token
    let valid = true
    if (token) {
        // Verify it
        jwt.verify(token as string, process.env.SESSION_SECRET as string, async (err, authData) => {
          if(err) {
            console.error(err)
            valid = false
            if (required && !valid) {
              res.sendStatus(403)
            }
            next()
          } else {
            const usersRef = firebaseAdmin.database().ref('users')
            usersRef.orderByChild(`id`).equalTo((authData as any).userId).once('value', snapshot => {
              req.token = token
              req.user = Object.values(snapshot.val() || {})[0]
              if (!req.user) valid = false;
              if (required && !valid) {
                res.sendStatus(403)
              }
              next()
            })
          }
      })
    } else {
      if (required) {
        res.sendStatus(403);
      }
    }
  };

// check if Token exists on request Header and attach token to request as attribute
export const required = validator({required: true})
export const optional = validator({required: false})

export const success = (req: Request, res: Response, next: NextFunction) => {
  jwt.sign({userId: req.user.id}, process.env.SESSION_SECRET as string, {expiresIn:'1 day'}, (err, token) => {
    if(err){
        res.sendStatus(500);
    } else {
      res.cookie('token', token)
      try {
        const {state} = req.query
        const {returnTo} = JSON.parse(Buffer.from(state, 'base64').toString())
        if (typeof returnTo === 'string' && returnTo.startsWith('http')) {
            res.redirect(returnTo)
        }
      } catch {
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
