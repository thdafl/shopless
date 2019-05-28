import nanoid from 'nanoid'
import express from 'express'
import passport from 'passport'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { OAuth2Strategy as GoogleStrategy, VerifyFunction } from 'passport-google-oauth'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as GithubStrategy} from 'passport-github'
import { Strategy as LocalStrategy, VerifyFunctionWithRequest as LocalVerifyFunctionWithRequest } from 'passport-local'

import * as normalizeProfile from './util/normalizeProfile'

import { 
  TWITTER_CONFIG, GOOGLE_CONFIG, FACEBOOK_CONFIG, GITHUB_CONFIG, LOCAL_CONFIG
} from './config'
import { getRepository } from 'typeorm';
import { User } from './graphql/typeDefs';

export default () => {  

  // Allowing passport to serialize and deserialize users into sessions
  passport.serializeUser<any, any>((user, cb) => cb(null, user.id))
  passport.deserializeUser<any, any>(async (userId, cb) => cb(null, await getRepository(User).findOne(userId)))
  
  // The callback that is invoked when an OAuth provider sends back user 
  // information. Normally, you would save the user to the database 
  // in this callback and it would be customized for each provider
  const callback: (req: express.Request, accessToken: string, refreshToken: string, profile: any, done: VerifyFunction) => void =
    async (req, __, ___, profile, cb) => {
      const provider: keyof typeof normalizeProfile = profile.provider

      const user = (
        (await getRepository(User).findOne({[`${provider}Id`]: profile.id})) ||
        (await getRepository(User).save(
          getRepository(User).create({
          ...normalizeProfile[provider](profile),
          [`${provider}Id`]: profile.id,
          // [provider]: profile
        })))
      )

      cb(null, user)
    }

  const localCallback: LocalVerifyFunctionWithRequest =
    async (req, username, password, cb) => {
      const connection = await getRepository(User)
      try {
        const searchResult = (await connection.find({ where: { username: username } }))
        if (searchResult.length > 0) {
          const user = searchResult[0]
          const verifyPassword = await user.passwordValidation(password)
          if (!verifyPassword) {
            return cb(null, false, { message: 'Incorrect Password' });
          }
          req.query.state = "https://localhost:8080/login/callback"
          cb(null, user)
        }
        else {
          return cb(null, false, { message: 'No User Found' });
        }
      } catch (err) {
        return cb(err)
      }
    }

  // Adding each OAuth provider's strategy to passport
  // passport.use(new TwitterStrategy(TWITTER_CONFIG, callback('twitter')))
  passport.use(new GoogleStrategy(GOOGLE_CONFIG, callback))
  // passport.use(new FacebookStrategy(FACEBOOK_CONFIG, callback))
  // passport.use(new GithubStrategy(GITHUB_CONFIG, callback))
  passport.use(new LocalStrategy(LOCAL_CONFIG, localCallback));
}
