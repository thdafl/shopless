import {buildSchema} from 'type-graphql'
import {Container} from 'typedi'

import {BrandResolver} from './resolvers/Brand'
import {UserResolver} from './resolvers/User'
import {ProductResolver} from './resolvers/Product'

export default () => buildSchema({
  resolvers: [BrandResolver, UserResolver, ProductResolver],
  container: Container
})
