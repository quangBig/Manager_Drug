import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ThuocController } from './thuoc.controller';
import { ThuocService } from './thuoc.service';



@Module({
    imports: [DatabaseModule],
    controllers: [ThuocController],
    providers: [ThuocService],
})
export class ThuocModule { }
