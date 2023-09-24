import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notes } from './entities/notes.entity'
import { CreateNoteDto } from './dto/create-note.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Notes)
        private readonly notesRepository: Repository<Notes>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(createNoteDto: CreateNoteDto) {
        const { user_id } = createNoteDto;
        const existUser = await this.userRepository.findOneBy({
            id: user_id
        })
        if (!existUser) {
            throw new HttpException("用户不存在", 404)
        }
        const newNote = this.notesRepository.create({
            ...createNoteDto,
            user: existUser
        })
        return this.notesRepository.save(newNote)


    }

    async getRecommandNotes(skip: number) {
        const realSkip = skip * 8
        const res = await this.notesRepository
            .createQueryBuilder('notes')
            .leftJoinAndSelect('notes.user', 'user')
            .skip(realSkip)
            .take(8)
            .select(['notes', 'user.id', 'user.username', 'user.nickname', 'user.avatar', 'user.fan', 'user.following', 'user.insignia',])
            .getMany();
        if (!res.length) {
            return this.notesRepository
                .createQueryBuilder('notes')
                .leftJoinAndSelect('notes.user', 'user')
                .select(['notes', 'user.id', 'user.username', 'user.nickname', 'user.avatar', 'user.fan', 'user.following', 'user.insignia',])
                .take(8)
                .getMany();
        }
        return res
    }
}
