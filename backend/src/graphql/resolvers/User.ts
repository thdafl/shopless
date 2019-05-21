import {AuthenticationError} from 'apollo-server-express'
import {Resolver, Query, Arg, Ctx} from 'type-graphql'

import {User} from '../typeDefs'

@Resolver(of => User)
export class UserResolver {
  @Query(returns => User)
  me(@Ctx('req') req: any) {
    if (!req.user) throw new AuthenticationError('Not authenticated')
    return req.user
  }
}
