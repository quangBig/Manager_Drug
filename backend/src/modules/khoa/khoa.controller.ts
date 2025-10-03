import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { KhoaService } from './khoa.service';

@Controller('khoa')
export class KhoaController {
    constructor(private readonly service: KhoaService) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get('search/:name')
    findOne(@Param('name') name: string) {
        return this.service.findOne(name);
    }

    @Post()
    create(@Body() body: { tenKhoa: string; moTa?: string }) {
        return this.service.create(body);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: { tenKhoa?: string; moTa?: string }) {
        return this.service.update(Number(id), body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(Number(id));
    }
}
