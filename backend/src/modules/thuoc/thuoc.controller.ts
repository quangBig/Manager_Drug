import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ThuocService } from './thuoc.service';

@Controller('thuoc')
export class ThuocController {
    constructor(private readonly thuocService: ThuocService) { }

    // 📌 Tạo thuốc mới
    @Post()
    create(@Body() data: any) {
        return this.thuocService.create(data);
    }

    // 📌 Lấy danh sách tất cả thuốc
    @Get()
    findAll() {
        return this.thuocService.findAll();
    }

    // 📌 Lấy thông tin 1 thuốc theo mã
    @Get(':maThuoc')
    findOne(@Param('maThuoc') maThuoc: string) {
        return this.thuocService.findOne(maThuoc);
    }

    // 📌 Cập nhật thuốc
    @Put(':maThuoc')
    update(@Param('maThuoc') maThuoc: string, @Body() data: any) {
        return this.thuocService.update(maThuoc, data);
    }

    // 📌 Xóa thuốc
    @Delete(':maThuoc')
    remove(@Param('maThuoc') maThuoc: string) {
        return this.thuocService.delete(maThuoc);
    }
}
