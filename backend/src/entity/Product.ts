import {Entity, Column, ManyToOne} from 'typeorm'
import {ObjectType, Field, ID} from 'type-graphql'

import {RelationColumn} from '../util/typeorm'
import {Base} from './Base'
import {Brand} from './Brand'

@Entity()
@ObjectType()
export class Product extends Base {
  @Column({length: 150})
  @Field()
  // @ts-ignore
  name: string;

  @Field(type => Brand)
  @ManyToOne(type => Brand)
  // @ts-ignore
  brand: Brand;
  @RelationColumn()
  // @ts-ignore
  brandId: string;
}
