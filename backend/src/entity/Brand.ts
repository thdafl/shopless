import {Entity, Column} from 'typeorm'
import {ObjectType, Field} from 'type-graphql'

import {Base} from './Base'

@Entity()
@ObjectType()
export class Brand extends Base {
    @Column({length: 100})
    @Field()
    //@ts-ignore
    name: string;
}
