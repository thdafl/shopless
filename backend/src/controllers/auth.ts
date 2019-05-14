export const twitter = (req: any, res: any) => {
  const io = req.app.get('io')
  const user = { 
    name: req.user.username,
    photo: req.user.photos[0].value.replace(/_normal/, '')
  }
  io.in(req.session.socketId).emit('twitter', user)
  res.end()
}

export const google = (req: any, res: any) => {
  const io = req.app.get('io')
  const user = { 
    name: req.user.displayName,
    photo: req.user.photos[0].value.replace(/sz=50/gi, 'sz=250')
  }
  io.in(req.session.socketId).emit('google', user)
  res.end()
}

export const facebook = (req: any, res: any) => {
  const io = req.app.get('io')
  const { givenName, familyName } = req.user.name
  const user = { 
    name: `${givenName} ${familyName}`,
    photo: req.user.photos[0].value
  }
  io.in(req.session.socketId).emit('facebook', user)
  res.end()
}

export const github = (req: any, res: any) => {
  const io = req.app.get('io')
  const user = { 
    name: req.user.username,
    photo: req.user.photos[0].value
  }
  io.in(req.session.socketId).emit('github', user)
  res.end()
} 
