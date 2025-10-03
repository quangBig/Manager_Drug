import { Module } from '@nestjs/common';
import { KhoService } from './kho.service';
import { KhoController } from './kho.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [KhoController],
    providers: [KhoService],
})
export class KhoModule { }
