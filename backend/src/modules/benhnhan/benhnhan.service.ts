import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class BenhNhanService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Pool) { }

    async findAll() {
        const [rows] = await this.db.query('SELECT * FROM BenhNhan');
        return rows;
    }

    async findOne(id: number) {
        const [rows] = await this.db.query('SELECT * FROM BenhNhan WHERE maBenhNhan = ?', [id]);
        if ((rows as any).length === 0) {
            throw new BadRequestException('Bệnh nhân không tồn tại');
        }
        return rows[0];
    }

    async create(data: { hoTen: string; ngaySinh?: string; gioiTinh?: string; diaChi?: string; dienThoai?: string }) {
        const [result] = await this.db.query(
            `INSERT INTO BenhNhan (hoTen, ngaySinh, gioiTinh, diaChi, dienThoai) 
       VALUES (?, ?, ?, ?, ?)`,
            [data.hoTen, data.ngaySinh ?? null, data.gioiTinh ?? null, data.diaChi ?? null, data.dienThoai ?? null],
        );
        return { insertId: (result as any).insertId };
    }

    async update(
        id: number,
        data: { hoTen?: string; ngaySinh?: string; gioiTinh?: string; diaChi?: string; dienThoai?: string },
    ) {
        await this.db.query(
            `UPDATE BenhNhan 
       SET hoTen = ?, ngaySinh = ?, gioiTinh = ?, diaChi = ?, dienThoai = ? 
       WHERE maBenhNhan = ?`,
            [
                data.hoTen ?? null,
                data.ngaySinh ?? null,
                data.gioiTinh ?? null,
                data.diaChi ?? null,
                data.dienThoai ?? null,
                id,
            ],
        );
        return { message: 'Cập nhật bệnh nhân thành công' };
    }

    async delete(id: number) {
        await this.db.query('DELETE FROM BenhNhan WHERE maBenhNhan = ?', [id]);
        return { message: 'Xóa bệnh nhân thành công' };
    }
}
