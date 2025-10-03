import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TonKhoController } from './tonkho.controller';
import { TonKhoService } from './tonkho.service';




@Module({
    imports: [DatabaseModule],
    controllers: [TonKhoController],
    providers: [TonKhoService],
})
export class TonKhoModule { }
