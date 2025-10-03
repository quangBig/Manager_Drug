import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { HangSanXuatService } from "./hangsanxuat.service";


@Controller('hang-san-xuat')
export class HangSanXuatController {
    constructor(private readonly service: HangSanXuatService) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get('search/:name')
    findOne(@Param('name') name: string) {
        return this.service.findOne(name);
    }

    @Post()
    create(@Body() body: { maHangSanXuat: string; tenHangSanXuat: string; quocGia: string | null; diaChi: string | null; dienThoai: number | null; email: string | null; website: string | null; ghiChu: string | null; trangThai?: number }) {
        return this.service.create(body);
    }

    @Put(':id')
    update(
        @Param('id') maHangSanXuat: string,
        @Body() body: {
            tenHangSanXuat: string;
            quocGia?: string | null;
            diaChi?: string | null;
            dienThoai?: number | null; // vẫn number từ client
            email?: string | null;
            website?: string | null;
            ghiChu?: string | null;
            trangThai?: number;
        }
    ) {
        // convert dienThoai sang string trước khi gửi service
        const updatedBody = {
            ...body,
            dienThoai: body.dienThoai !== undefined && body.dienThoai !== null ? String(body.dienThoai) : null
        };

        return this.service.update(maHangSanXuat, updatedBody);
    }


    @Delete(':id')
    delete(@Param('id') maHangSanXuat: string) {
        return this.service.delete(maHangSanXuat);
    }
}
