import { Module } from '@nestjs/common';
import { AdrService } from './adr.service';
import { AdrController } from './adr.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [AdrController],
    providers: [AdrService],
})
export class AdrModule { }
