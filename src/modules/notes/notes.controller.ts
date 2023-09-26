import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  @Post()
  create(@Body() createNoteDto:CreateNoteDto){
    return this.notesService.create(createNoteDto)
  }

  @Get()
  getRecommandNotes(@Query('skip') skip:number){
    return this.notesService.getRecommandNotes(skip)
  }

  @Get('search')
  search(@Query('keyword') keyword:string){
    return this.notesService.search(keyword)
  }
}
