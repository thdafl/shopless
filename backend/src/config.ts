import {IStrategyOption} from 'passport-twitter'
import { IOAuth2StrategyOption } from 'passport-google-oauth';

export const PORT = process.env.BACKEND_PORT || process.env.PORT || 8081

const providers = ['twitter', 'google', 'facebook', 'github']

const callbacks = providers.map(provider => {
  return process.env.NODE_ENV === 'development'
    ? `https://localhost:8081/${provider}/callback`
    : `https://api-shopless.herokuapp.com/${provider}/callback`
})

const [twitterURL, googleURL, facebookURL, githubURL] = callbacks

export const CLIENT_ORIGIN = process.env.NODE_ENV === 'production'
  ? 'https://shopless.netlify.com'
  : ['https://127.0.0.1:8080', 'https://localhost:8080']

export const TWITTER_CONFIG: IStrategyOption = {
  consumerKey: process.env.TWITTER_KEY as string,
  consumerSecret: process.env.TWITTER_SECRET as string,
  callbackURL: twitterURL,
  passReqToCallback: false
}

export const GOOGLE_CONFIG: IOAuth2StrategyOption = {
  clientID: process.env.GOOGLE_KEY as string,
  clientSecret: process.env.GOOGLE_SECRET as string,
  callbackURL: googleURL
}

export const FACEBOOK_CONFIG: IOAuth2StrategyOption = {
  clientID: process.env.FACEBOOK_KEY as string,
  clientSecret: process.env.FACEBOOK_SECRET as string,
  // profileFields: ['id', 'emails', 'name', 'picture.width(250)'],
  callbackURL: facebookURL
}

export const GITHUB_CONFIG: IOAuth2StrategyOption = {
  clientID: process.env.GITHUB_KEY as string,
  clientSecret: process.env.GITHUB_SECRET as string,
  callbackURL: githubURL
}