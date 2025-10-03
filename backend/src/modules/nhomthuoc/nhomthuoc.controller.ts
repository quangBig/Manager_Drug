import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { NhomThuocService } from "./nhomthuoc.service";

@Controller("nhom-thuoc")
export class NhomThuocController {
    constructor(private readonly service: NhomThuocService) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get("search/:id")
    findOne(@Param("id") id: string) {
        return this.service.findOne(id);
    }


    @Post()
    create(
        @Body() body: { maNhomThuoc: string; tenNhomThuoc: string; maNhomCha?: string | null; moTa?: string; trangThai?: number },
    ) {
        return this.service.create(body);
    }

    @Put(":id")
    update(
        @Param("id") id: string,
        @Body() body: { tenNhomThuoc?: string; maNhomCha?: string | null; moTa?: string; trangThai?: number },
    ) {
        return this.service.update(id, body);
    }

    @Delete(":id")
    delete(@Param("id") id: string) {
        return this.service.delete(id);
    }
}
