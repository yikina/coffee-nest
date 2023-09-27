import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Notes } from './entities/notes.entity'
import { CreateNoteDto } from './dto/create-note.dto';
import { User } from '../user/entities/user.entity';
import { OSS_URL } from 'src/common/constant/alicloud';
import axios from 'axios'

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Notes)
        private readonly notesRepository: Repository<Notes>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(createNoteDto: CreateNoteDto) {
        const { user_id, pic } = createNoteDto;
        const existUser = await this.userRepository.findOneBy({
            id: user_id
        })
        if (!existUser) {
            throw new HttpException("用户不存在", 404)
        }
        const picUrl = []
        const promises = [];
        if (pic.includes(',')) {
            const pics = pic.split(',');
            for (const p of pics) {
                promises.push(
                    axios.get(OSS_URL + p + '?x-oss-process=image/info').
                        then((res) => {
                            const { ImageHeight, ImageWidth } = res.data;
                            const height = parseInt(ImageHeight.value);
                            const width = parseInt(ImageWidth.value);
                            const hwscale = Number((height / width).toFixed(2))

                            picUrl.push({
                                url: p, height, width, hwscale
                            })
                        }).catch((e) => {
                            console.log(e, 'eee--')
                        })
                )
            }
        } else {
            promises.push(
                axios.get(OSS_URL + pic + '?x-oss-process=image/info').
                    then((res) => {
                        const { ImageHeight, ImageWidth } = res.data;
                        const height = parseInt(ImageHeight.value);
                        const width = parseInt(ImageWidth.value);
                        const hwscale = Number((height / width).toFixed(2));

                        picUrl.push({
                            url: pic, height, width, hwscale
                        })
                    }).catch((e) => {
                        console.log(e, 'eee--')
                    })
            )
        }
        await Promise.all(promises);
        const newNote = this.notesRepository.create({
            ...createNoteDto,
            pic: picUrl,
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

    async search(keyword:string){
        return this.notesRepository.createQueryBuilder('notes')
            .leftJoinAndSelect('notes.user', 'user')
            .select(['notes', 'user.id', 'user.username', 'user.nickname', 'user.avatar', 'user.fan', 'user.following', 'user.insignia',])
            .where('notes.title LIKE :keyword', { keyword: `%${keyword}%` })
            .getMany();
}}
