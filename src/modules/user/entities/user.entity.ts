import { BeforeInsert, Column,Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Exclude } from "class-transformer";
import { Notes } from "src/modules/notes/entities/notes.entity";

@Entity('user')
export class User{
    @PrimaryGeneratedColumn('uuid')  //使用uuid为每一位用户生成独立唯一的id
    id:string;

    @PrimaryColumn({length:100})
    username:string;

    @Column({default:'',length:100})
    nickname:string;

    @Exclude() //排除密码字段
    @Column({length:100})
    password:string;

    @Column({default:null})
    avatar:string;

    @Column({default:0})
    fan:number;

    @Column({default:0})
    following:number;

    @Column({default:0})
    insignia:number;

    @OneToMany(type=>Notes,notes=>notes.user)
    notes:Notes[];

    @BeforeInsert()
    async hashPassword(){
        if(!this.password) return
        //加密密码
        this.password=await bcrypt.hashSync(this.password,10)
    }
}
