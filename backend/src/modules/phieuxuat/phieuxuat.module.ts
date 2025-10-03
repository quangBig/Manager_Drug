import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PhieuXuatController } from './phieuxuat.controller';
import { PhieuXuatService } from './phieuxuat.service';




@Module({
    imports: [DatabaseModule],
    controllers: [PhieuXuatController],
    providers: [PhieuXuatService],
})
export class PhieuXuatModule { }
