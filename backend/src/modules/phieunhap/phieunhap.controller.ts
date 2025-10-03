import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PhieuNhapService } from './phieunhap.service';
// import { CreatePhieuNhapDto } from './dto/create-phieunhap.dto';

@Controller('phieunhap')
export class PhieuNhapController {
    constructor(private readonly service: PhieuNhapService) { }

    // Tạo mới phiếu nhập
    @Post()
    create(@Body() data: any) {
        return this.service.create(data);
    }

    // Lấy tất cả phiếu nhập
    @Get()
    findAll() {
        return this.service.findAll();
    }

    // Lấy phiếu nhập theo ID
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(+id);
    }

    // Cập nhật phiếu nhập
    @Put(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.service.update(+id, body);
    }

    // Xóa phiếu nhập
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(+id);
    }
}
