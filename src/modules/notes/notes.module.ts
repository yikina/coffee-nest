import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notes } from './entities/notes.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Notes,User])
  ],
  controllers: [NotesController],
  providers: [NotesService]
})
export class NotesModule {}
