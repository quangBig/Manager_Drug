// src/nhom-thuoc/nhom-thuoc.module.ts
import { Module } from '@nestjs/common';
import { NhomThuocController } from './nhomthuoc.controller';
import { NhomThuocService } from './nhomthuoc.service';
import { DatabaseModule } from 'src/database/database.module';



@Module({
    imports: [DatabaseModule],
    controllers: [NhomThuocController],
    providers: [NhomThuocService],
})
export class NhomThuocModule { }
