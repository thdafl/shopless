import {ObjectType, Field} from 'type-graphql'

export * from '../entity'

@ObjectType()
export class User {
  @Field()
  // @ts-ignore
  name: string;

  @Field()
  // @ts-ignore
  photo?: string;
}
