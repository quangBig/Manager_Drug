import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { NhaCungCapService } from "./nhacungcap.service";


@Controller('nha-cung-cap')
export class NhaCungCapController {
    constructor(private readonly nhaCungCapService: NhaCungCapService) { }

    @Get()
    findAll() {
        return this.nhaCungCapService.findAll();
    }

    @Get(':id')
    findByName(@Param('id') id: number) {
        return this.nhaCungCapService.findByName(id);
    }

    @Post()
    create(@Body() body: { tenNhaCungCap: string; diaChi?: string; dienThoai?: string }) {
        return this.nhaCungCapService.create(body);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() body: any) {
        return this.nhaCungCapService.update(id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.nhaCungCapService.delete(id);
    }
}
