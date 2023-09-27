import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

type picProps={
 url:string,
 height:number,
 width:number,
 hwScale:number
}
@Entity('notes')
export class Notes {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    title: string;

    @Column({ length: 300 })
    content: string;

    @Column('jsonb',{
        nullable:true
    })
    pic:picProps[];

    @ManyToOne(type => User, user => user.notes, { cascade: true })
    user: User;


    @Column({ default: 0 })
    collection: number;

}