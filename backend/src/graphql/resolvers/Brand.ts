import {getRepository} from 'typeorm'
import {Resolver, Query, Arg} from 'type-graphql'

import {Brand} from '../typeDefs'

@Resolver(of => Brand)
export class BrandResolver {
  @Query(returns => Brand, {nullable: true})
  brand(@Arg('id') id: string) {
    return getRepository(Brand).findOne(id)
  }
}
