import {InputType, Field, ID} from 'type-graphql'
import {MaxLength} from 'class-validator'

import {Brand} from '../../entity'

@InputType()
export class BrandInput implements Partial<Brand> {
  @Field()
  @MaxLength(100)
  // @ts-ignore
  name: string;
}
