import {Entity, Column, ManyToOne} from 'typeorm'
import {ObjectType, Field, ID} from 'type-graphql'
import bcrypt from 'bcrypt';

import {Base} from './Base'

@Entity()
@ObjectType()
export class User extends Base {
  @Column({length: 100})
  @Field()
  // @ts-ignore
  name: string;

  @Column({ nullable: true })
  @Field()
  // @ts-ignore
  photo?: string;

  @Column({ nullable: true })
  // @ts-ignore
  googleId?: string;

  @Column({ type: "text", unique: true, nullable: true })
  //@ts-ignore
  username: string;

  @Column({ nullable: true })
  //@ts-ignore
  password: string;

  hashing = async (password: string) => {
    console.log('inside hashing')
    try {
      const hash = await bcrypt.hash(password, 10);
      this.password = hash;

    } catch (err) {
      console.log(err);
    }
  }

  passwordValidation = async (inputPassword: string) => {
    return await bcrypt.compare(inputPassword, this.password);
  }
}
