import { Module } from "@nestjs/common";
import { HangSanXuatService } from "./hangsanxuat.service";
import { HangSanXuatController } from "./hangsanxuat.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [HangSanXuatController],
    providers: [HangSanXuatService],
})
export class HangSanXuatModule { }
