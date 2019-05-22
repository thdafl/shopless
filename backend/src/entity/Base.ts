import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";
import {ObjectType, Field, ID} from 'type-graphql'

@Entity()
@ObjectType()
export class Base {
    @PrimaryGeneratedColumn('uuid')
    @Field(type => ID)
    //@ts-ignore
    readonly id: string;

    @CreateDateColumn()
    @Field()
    //@ts-ignore
    createdAt: Date;


    @UpdateDateColumn()
    @Field()
    //@ts-ignore
    updatedAt: Date;
}
