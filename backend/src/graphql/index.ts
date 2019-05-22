import {buildSchema} from 'type-graphql'
import {Container} from 'typedi'

import {BrandResolver} from './resolvers/Brand'
import {UserResolver} from './resolvers/User'

export default () => buildSchema({
  resolvers: [BrandResolver, UserResolver],
  container: Container
})
