import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('notes')
export class Notes {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    title: string;

    @Column({ length: 300 })
    content: string;

    @Column()
    pic: string;

    @ManyToOne(type => User, user => user.notes, { cascade: true })
    user: User;

    @Column({ default: null })
    avatar: string;

    @Column({ default: 0 })
    collection: number;

}