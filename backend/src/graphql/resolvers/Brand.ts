import {getRepository, Repository} from 'typeorm'
import {Resolver, Query, Arg, Mutation, Ctx, Root, FieldResolver, Field} from 'type-graphql'
import {InjectRepository} from 'typeorm-typedi-extensions'

import {Brand, User, Product} from '../typeDefs'
import {BrandInput} from '../inputs/BrandInput'
import { AuthenticationError } from 'apollo-server-core';

@Resolver(of => Brand)
export class BrandResolver {
  constructor(
    @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}
  
  @Query(returns => Brand, {nullable: true})
  brand(@Arg('id') id: string) {
    return getRepository(Brand).findOne(id)
  }

  @Mutation(returns => Brand)
  async addBrand(
    @Arg('brand') brandInput: BrandInput,
    @Ctx('req') {user}: any
  ) {
    if (!user) throw new AuthenticationError('User account needed')
    const brand = this.brandRepository.create({
      ...brandInput,
      authorId: user.id
    })
    return this.brandRepository.save(brand)
  }

  @FieldResolver()
  async author(@Root() brand: Brand): Promise<User> {
    return this.userRepository.findOne(brand.authorId) as Promise<User>
  }

  @FieldResolver()
  products(@Root() brand: Brand): Promise<Product[]> {
    return this.productRepository.find({brandId: brand.id})
  }
}
