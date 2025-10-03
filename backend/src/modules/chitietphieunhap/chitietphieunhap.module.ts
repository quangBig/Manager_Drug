import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ChiTietPhieuNhapController } from './chitietphieunhap.controller';
import { ChiTietPhieuNhapService } from './chitietphieunhap.service';

@Module({
    imports: [DatabaseModule],
    controllers: [ChiTietPhieuNhapController],
    providers: [ChiTietPhieuNhapService],
})
export class ChiTietPhieuNhapModule { }
