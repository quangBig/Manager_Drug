import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PhieuNhapController } from './phieunhap.controller';
import { PhieuNhapService } from './phieunhap.service';



@Module({
    imports: [DatabaseModule],
    controllers: [PhieuNhapController],
    providers: [PhieuNhapService],
})
export class PhieuNhapModule { }
