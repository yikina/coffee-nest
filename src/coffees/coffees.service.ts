import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdataCoffeeDto } from './dto/create-coffee.dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
    //连接真实数据库
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository:Repository<Coffee>,
    ){}

    findAll(){
        return this.coffeeRepository.find()
    }
    
    async findOne(id:string){
        const coffee=await this.coffeeRepository.findOneBy({id:+id});
        if(!coffee){
            throw new HttpException(`coffee ${id} not found`,404)
        }
        return coffee;
    }

    create(createCoffeeDto:CreateCoffeeDto){
        const coffee=this.coffeeRepository.create(createCoffeeDto)
        return this.coffeeRepository.save(coffee)
    }

    async update(id:string,updatecoffeeDto:UpdataCoffeeDto){
       const coffee=await this.coffeeRepository.preload({
        id:+id,
        ...updatecoffeeDto
       })
       if(!coffee){
        throw new NotFoundException(`coffee ${id} not found`)
       }
       return this.coffeeRepository.save(coffee);
    }

    async remove(id:string){
        const coffee=await this.findOne(id);
        return this.coffeeRepository.remove(coffee)
       
    }
}
