import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ChiTietPhieuXuatService } from './chitietphieuxuat.service';
import { ChiTietPhieuXuatController } from './chitietphieuxuat.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [ChiTietPhieuXuatController],
    providers: [ChiTietPhieuXuatService],
})
export class ChiTietPhieuXuatModule { }
