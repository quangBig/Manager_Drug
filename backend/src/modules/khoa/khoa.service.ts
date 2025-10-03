import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class KhoaService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Pool) { }

    async findAll() {
        const [rows] = await this.db.query('SELECT * FROM Khoa');
        return rows;
    }

    async findOne(name: string) {
        const [rows] = await this.db.query('SELECT * FROM Khoa WHERE tenKhoa LIKE ?', [`%${name}%`]);
        if ((rows as any).length === 0) {
            throw new BadRequestException('Khoa không tồn tại');
        }
        return rows[0];
    }

    async create(data: { tenKhoa: string; moTa?: string }) {
        const [check] = await this.db.query(
            'SELECT COUNT(*) as cnt FROM Khoa WHERE tenKhoa = ?',
            [data.tenKhoa],
        );
        if ((check as any)[0].cnt > 0) {
            throw new BadRequestException('Tên khoa đã tồn tại');
        }

        const [result] = await this.db.query(
            'INSERT INTO Khoa (tenKhoa, moTa) VALUES (?, ?)',
            [data.tenKhoa, data.moTa ?? null],
        );
        return { insertId: (result as any).insertId };
    }

    async update(id: number, data: { tenKhoa?: string; moTa?: string }) {
        if (data.tenKhoa) {
            const [check] = await this.db.query(
                'SELECT COUNT(*) as cnt FROM Khoa WHERE tenKhoa = ? AND maKhoa != ?',
                [data.tenKhoa, id],
            );
            if ((check as any)[0].cnt > 0) {
                throw new BadRequestException('Tên khoa đã tồn tại');
            }
        }

        await this.db.query(
            'UPDATE Khoa SET tenKhoa = ?, moTa = ? WHERE maKhoa = ?',
            [data.tenKhoa, data.moTa ?? null, id],
        );
        return { message: 'Cập nhật thành công' };
    }

    async delete(id: number) {
        await this.db.query('DELETE FROM Khoa WHERE maKhoa = ?', [id]);
        return { message: 'Xóa thành công' };
    }
}
