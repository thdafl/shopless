import {Entity, Column, PrimaryGeneratedColumn, BeforeInsert} from "typeorm";
import bcrypt from 'bcrypt';

@Entity()
export class LocalUser {

    @PrimaryGeneratedColumn("uuid")
    //@ts-ignore
    id: string;

    @Column({type:"text",unique:true})
    //@ts-ignore
    username: string;

    @Column()
    //@ts-ignore
    password: string;

    @BeforeInsert()
    hashing = async() => {
        try {
            const hash = await bcrypt.hash(this.password, 10);
            this.password = hash;
     
        } catch (err) {
            console.log(err);
        }
    }

    passwordValidation=async (inputPassword: string)=> {
        return await bcrypt.compare(inputPassword, this.password);
    }

}

