import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ThuocService } from './thuoc.service';

@Controller('thuoc')
export class ThuocController {
    constructor(private thuocService: ThuocService) { }

    @Post()
    create(@Body() data: any) {
        return this.thuocService.create(data);
    }

    @Get()
    findAll() {
        return this.thuocService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.thuocService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() data: any) {
        return this.thuocService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.thuocService.delete(id);
    }
}
