import {Profile as TwitterProfile} from 'passport-twitter'
import {Profile as GoogleProfile} from 'passport-google-oauth';
import {Profile as FacebookProfile} from 'passport-facebook';
import {Profile as GithubProfile} from 'passport-github';

export const twitter = (user: TwitterProfile) => (
  {
    name: user.username,
    photo: user.photos ? user.photos[0].value.replace(/_normal/, '') : undefined
  }
)

export const google = (user: GoogleProfile) => (
  {
    name: user.displayName,
    photo: user.photos ? user.photos[0].value.replace(/sz=50/gi, 'sz=250') : undefined
  }
)

export const facebook = (user: FacebookProfile) => (
  {
    name: user.displayName,
    photo: user.photos ? user.photos[0].value : undefined
  }
)

export const github = (user: GithubProfile) => (
  {
    name: user.username,
    photo: user.photos ? user.photos[0].value : undefined
  }
)

export const local = (user: any) => (
  {
    name: user.username,
    photo: ""
  }
)