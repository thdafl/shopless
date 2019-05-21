import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";
import {ObjectType, Field, ID} from 'type-graphql'

@Entity()
@ObjectType()
export class Base {
    @PrimaryGeneratedColumn('uuid')
    @Field(type => ID)
    //@ts-ignore
    id: number;

    @CreateDateColumn()
    @Field()
    //@ts-ignore
    created_at: Date;


    @UpdateDateColumn()
    @Field()
    //@ts-ignore
    updated_at: Date;
}
