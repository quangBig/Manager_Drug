import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { Pool } from "mysql2/promise";

@Injectable()
export class HangSanXuatService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Pool) { }

    async findAll() {
        const [rows] = await this.db.query('SELECT * FROM HangSanXuat');
        return rows
    }

    async findOne(id: string) {
        const [rows] = await this.db.query(
            'SELECT * FROM HangSanXuat WHERE maHangSanXuat = ?', [id]
        );
        return rows;
    }

    async create(data: { maHangSanXuat: string; tenHangSanXuat: string; quocGia: string | null; diaChi: string | null; dienThoai: number | null; email: string | null; website: string | null; ghiChu: string | null; trangThai?: number }) {
        // check duplicate
        const [check] = await this.db.query(
            'SELECT COUNT(*) as cnt FROM HangSanXuat WHERE tenHangSanXuat = ?',
            [data.tenHangSanXuat],
        );

        if ((check as any)[0].cnt > 0) {
            throw new BadRequestException('Hãng sản xuất đã tồn tại');
        }

        const [result] = await this.db.query(
            'INSERT INTO HangSanXuat (maHangSanXuat, tenHangSanXuat, quocGia, diaChi, dienThoai, email, website, ghiChu, trangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                data.maHangSanXuat,
                data.tenHangSanXuat,
                data.quocGia,
                data.diaChi,
                data.dienThoai,
                data.email,
                data.website,
                data.ghiChu,
                data.trangThai ?? null
            ],
        );


        return { insertId: (result as any).insertId };
    }

    async update(
        maHangSanXuat: string,
        data: {
            tenHangSanXuat: string;
            quocGia?: string | null;
            diaChi?: string | null;
            dienThoai?: string | null;
            email?: string | null;
            website?: string | null;
            ghiChu?: string | null;
            trangThai?: number;
        }
    ) {
        await this.db.query(
            `UPDATE HangSanXuat 
     SET tenHangSanXuat = ?, quocGia = ?, diaChi = ?, dienThoai = ?, email = ?, website = ?, ghiChu = ?, trangThai = ? 
     WHERE maHangSanXuat = ?`,
            [
                data.tenHangSanXuat,
                data.quocGia ?? null,
                data.diaChi ?? null,
                data.dienThoai ?? null,
                data.email ?? null,
                data.website ?? null,
                data.ghiChu ?? null,
                data.trangThai ?? null,
                maHangSanXuat
            ]
        );

        return { message: 'Cập nhật thành công' };
    }


    async delete(maHangSanXuat: string) {
        const [check] = await this.db.query(
            'SELECT COUNT(*) as cnt FROM TaiSan WHERE maHangSanXuat = ?',
            [maHangSanXuat]
        );

        if ((check as any)[0].cnt > 0) {
            throw new BadRequestException('Không thể xóa hãng sản xuất vì còn tài sản liên quan');
        }

        await this.db.query('DELETE FROM HangSanXuat WHERE maHangSanXuat = ?', [maHangSanXuat]);
        return { message: 'Xóa thành công' };
    }

}