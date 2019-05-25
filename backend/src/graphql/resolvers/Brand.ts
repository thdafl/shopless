import {getRepository, Repository} from 'typeorm'
import {Resolver, Query, Arg, Mutation, Ctx, Root, FieldResolver, Field} from 'type-graphql'
import {InjectRepository} from 'typeorm-typedi-extensions'
import firebaseAdmin from 'firebase-admin'

import {Brand, User} from '../typeDefs'
import {BrandInput} from '../inputs/BrandInput'
import { AuthenticationError } from 'apollo-server-core';
import { Product } from '../../entity';

@Resolver(of => Brand)
export class BrandResolver {
  constructor(
    @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
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
  author(@Root() brand: Brand): Promise<User> {
    return new Promise((resolve) => {
      const usersRef = firebaseAdmin.database().ref('users')
      usersRef.orderByChild(`id`).equalTo(brand.authorId).once('value', snapshot => {
        console.log(snapshot.val())
        resolve(Object.values(snapshot.val() || {})[0] as User)
      })
    })
  }

  @FieldResolver()
  products(@Root() brand: Brand): Promise<Product[]> {
    return this.productRepository.find({brandId: brand.id})
  }
}
