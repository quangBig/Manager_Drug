import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { NhaCungCapController } from './nhacungcap.controller';
import { NhaCungCapService } from './nhacungcap.service';

@Module({
    imports: [DatabaseModule],
    controllers: [NhaCungCapController],
    providers: [NhaCungCapService],
})
export class NhaCungCapModule { }
