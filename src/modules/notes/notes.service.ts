import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Notes} from './entities/notes.entity'
import { CreateNoteDto } from './dto/create-note.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Notes)
        private readonly notesRepository:Repository<Notes>,
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,
    ){}

    async create(createNoteDto:CreateNoteDto){
        const {username} = createNoteDto;
        const existUser = await this.userRepository.findOneBy({
           username:username
        })
        if(!existUser){
            throw new HttpException("用户不存在", 404)
        }
        const newNote = this.notesRepository.create({
            ...createNoteDto,
            user:existUser
        })
        return this.notesRepository.save(newNote)


    }
 }
