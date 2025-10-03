import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ChiTietPhieuNhapService } from './chitietphieunhap.service';

@Controller('chitietphieunhap')
export class ChiTietPhieuNhapController {
    constructor(private readonly service: ChiTietPhieuNhapService) { }

    // Lấy tất cả chi tiết phiếu nhập
    @Get()
    findAll() {
        return this.service.findAll();
    }

    // Lấy chi tiết phiếu nhập theo id
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    // Tạo mới chi tiết phiếu nhập
    @Post()
    create(@Body() data: any) {
        return this.service.create(data);
    }

    // Update chi tiết phiếu nhập
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.service.update(id, data);
    }

    // Xóa chi tiết phiếu nhập
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
