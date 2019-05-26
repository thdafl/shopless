import {Entity, Column, ManyToOne} from 'typeorm'
import {ObjectType, Field, ID, Authorized} from 'type-graphql'
import {GraphQLJSON} from 'graphql-type-json'

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
    @RelationColumn()
    // @ts-ignore
    authorId: string;

    @Column({type: 'json', nullable: true})
    @Field(type => GraphQLJSON)
    // @ts-ignore
    setting: object;
}
