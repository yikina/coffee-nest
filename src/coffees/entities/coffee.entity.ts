import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()  //自动生成SQL表名为小写开头，这里为coffee
//@Entity('cats') 生成名为cats的SQL表
export class Coffee{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    brand:string;

    @Column('json',{nullable:true})
    flavors:string[];
}