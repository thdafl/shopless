import {Entity, Column, ManyToOne} from 'typeorm'
import {ObjectType, Field, ID} from 'type-graphql'

import {RelationColumn} from '../util/typeorm'
import {User} from '../graphql/typeDefs'
import {Base} from './Base'

@Entity()
@ObjectType()
export class Brand extends Base {
    @Column({length: 100})
    @Field()
    //@ts-ignore
    name: string;

    @Field(type => User)
    // @ManyToOne(type => User)
    // @ts-ignore
    author: User;
    @RelationColumn({length: 30})
    // @ts-ignore
    authorId: string;
}
