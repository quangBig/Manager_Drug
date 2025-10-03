import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { AdrService } from './adr.service';

@Controller('adr')
export class AdrController {
    constructor(private readonly adrService: AdrService) { }

    @Get()
    findAll() {
        return this.adrService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.adrService.findOne(id);
    }

    @Post()
    create(@Body() body: any) {
        return this.adrService.create(body);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        return this.adrService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.adrService.remove(id);
    }
}
