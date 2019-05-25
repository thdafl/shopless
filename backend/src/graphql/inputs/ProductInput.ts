import {InputType, Field, ID} from 'type-graphql'
import {MaxLength} from 'class-validator'

import {Product} from '../../entity'

@InputType()
export class ProductInput implements Partial<Product> {
  @Field()
  @MaxLength(120)
  // @ts-ignore
  name: string;

  @Field()
  // @ts-ignore
  brandId: string;
}
