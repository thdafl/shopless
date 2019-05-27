import {Entity, Column, ManyToOne} from 'typeorm'
import {ObjectType, Field, ID} from 'type-graphql'

import {Base} from './Base'

@Entity()
@ObjectType()
export class User extends Base {
  @Column({length: 100})
  @Field()
  // @ts-ignore
  name: string;

  @Column()
  @Field()
  // @ts-ignore
  photo?: string;

	@Column({ nullable: true })
	// @ts-ignore
	googleId?: string;
	
	@Column({ nullable: true })
	// @ts-ignore
	localId?: string;
}
