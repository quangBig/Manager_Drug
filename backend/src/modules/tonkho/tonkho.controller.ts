import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TonKhoService } from './tonkho.service';

@Controller('tonkho')
export class TonKhoController {
    constructor(private readonly tonKhoService: TonKhoService) { }

    @Get()
    findAll() {
        return this.tonKhoService.findAll();
    }

    @Get('kho/:maKho')
    findByKho(@Param('maKho') maKho: number) {
        return this.tonKhoService.findByKho(maKho);
    }

    @Post()
    create(@Body() data: any) {
        return this.tonKhoService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() data: any) {
        return this.tonKhoService.update(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.tonKhoService.delete(id);
    }
}
