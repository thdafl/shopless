import {getRepository, Repository} from 'typeorm'
import {Resolver, Query, Arg, Mutation, Ctx, Root, FieldResolver} from 'type-graphql'
import {InjectRepository} from 'typeorm-typedi-extensions'

import {Brand, Product} from '../typeDefs'
import {ProductInput} from '../inputs/ProductInput'
import { AuthenticationError } from 'apollo-server-core';

@Resolver(of => Product)
export class ProductResolver {
  constructor(
    @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  ) {}
  
  @Query(returns => Product, {nullable: true})
  product(@Arg('id') id: string) {
    return this.productRepository.findOne(id)
  }

  @Mutation(returns => Product)
  async addProduct(
    @Arg('product') productInput: ProductInput,
    @Ctx('req') {user}: any
  ) {
    if (!user) throw new AuthenticationError('User account needed')
    const brand = await this.brandRepository.findOne(productInput.brandId) as Brand
    const product = this.productRepository.create({
      ...productInput,
      brandId: brand.id
    })
    return this.productRepository.save(product)
  }

  @FieldResolver()
  brand(@Root() product: Product): Promise<Brand> {
    return this.brandRepository.findOne(product.brandId) as Promise<Brand>
  }
}
