import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { NhomThuocModule } from './modules/nhomthuoc/nhomthuoc.module';
import { HangSanXuatModule } from './modules/hangsanxuat/hangsanxuat.module';
import { KhoaModule } from './modules/khoa/khoa.module';
import { KhoModule } from './modules/kho/kho.module';
import { BenhNhanModule } from './modules/benhnhan/benhnhan.module';
import { ThuocModule } from './modules/thuoc/thuoc.module';
import { TonKhoModule } from './modules/tonkho/tonkho.module';
import { NhaCungCapModule } from './modules/nhacungcap/nhacungcap.module';
import { PhieuNhapModule } from './modules/phieunhap/phieunhap.module';
import { ChiTietPhieuNhapModule } from './modules/chitietphieunhap/chitietphieunhap.module';
import { PhieuXuatModule } from './modules/phieuxuat/phieuxuat.module';
import { ChiTietPhieuXuatModule } from './modules/chitietphieuxuat/chitietphieuxuat.module';
import { AdrModule } from './modules/adr/adr.module';

@Module({
  imports: [DatabaseModule,
    NhomThuocModule,
    HangSanXuatModule,
    KhoaModule,
    KhoModule,
    BenhNhanModule,
    ThuocModule,
    TonKhoModule,
    NhaCungCapModule,
    PhieuNhapModule,
    ChiTietPhieuNhapModule,
    PhieuXuatModule,
    ChiTietPhieuXuatModule,
    AdrModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
