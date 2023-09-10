import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";

@Entity()  //自动生成SQL表名为小写开头，这里为coffee
//@Entity('cats') 生成名为cats的SQL表
export class Coffee{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    brand:string;

    @Column({default:0})
    recommendations:number;

    @JoinTable()
    @ManyToMany(
        type => Flavor,
        flavor => flavor.coffees,
        {
            cascade: true,//启用联级插入
        }
    )
    flavors:Flavor[];
}