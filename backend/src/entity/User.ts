import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    //@ts-ignore
    id: number;

    @Column()
    //@ts-ignore
    firstName: string;

    @Column()
    //@ts-ignore
    lastName: string;

    @Column()
    //@ts-ignore
    age: number;
}
