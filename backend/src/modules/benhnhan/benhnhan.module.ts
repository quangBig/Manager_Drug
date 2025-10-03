import { Module } from '@nestjs/common';
import { BenhNhanService } from './benhnhan.service';
import { BenhNhanController } from './benhnhan.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [BenhNhanController],
    providers: [BenhNhanService],
})
export class BenhNhanModule { }
