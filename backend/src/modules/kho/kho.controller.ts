import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { KhoService } from './kho.service';

@Controller('kho')
export class KhoController {
    constructor(private readonly service: KhoService) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(Number(id));
    }

    @Post()
    create(@Body() body: { tenKho: string; maThuKho?: number }) {
        return this.service.create(body);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: { tenKho?: string; maThuKho?: number }) {
        return this.service.update(Number(id), body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(Number(id));
    }
}
