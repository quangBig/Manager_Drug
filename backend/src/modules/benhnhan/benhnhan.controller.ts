import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BenhNhanService } from './benhnhan.service';

@Controller('benh-nhan')
export class BenhNhanController {
    constructor(private readonly service: BenhNhanService) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(Number(id));
    }

    @Post()
    create(
        @Body()
        body: { hoTen: string; ngaySinh?: string; gioiTinh?: string; diaChi?: string; dienThoai?: string },
    ) {
        return this.service.create(body);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() body: { hoTen?: string; ngaySinh?: string; gioiTinh?: string; diaChi?: string; dienThoai?: string },
    ) {
        return this.service.update(Number(id), body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(Number(id));
    }
}
