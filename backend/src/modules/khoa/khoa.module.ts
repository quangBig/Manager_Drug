import { Module } from '@nestjs/common';
import { KhoaService } from './khoa.service';
import { KhoaController } from './khoa.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [KhoaController],
    providers: [KhoaService],
})
export class KhoaModule { }
