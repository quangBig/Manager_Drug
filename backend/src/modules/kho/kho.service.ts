import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class KhoService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Pool) { }

    async findAll() {
        const [rows] = await this.db.query('SELECT * FROM Kho');
        return rows;
    }

    async findOne(id: number) {
        const [rows] = await this.db.query('SELECT * FROM Kho WHERE maKho = ?', [id]);
        if ((rows as any).length === 0) {
            throw new BadRequestException('Kho không tồn tại');
        }
        return rows[0];
    }

    async create(data: { tenKho: string; maThuKho?: number }) {
        const [check] = await this.db.query(
            'SELECT COUNT(*) as cnt FROM Kho WHERE tenKho = ?',
            [data.tenKho],
        );
        if ((check as any)[0].cnt > 0) {
            throw new BadRequestException('Tên kho đã tồn tại');
        }

        const [result] = await this.db.query(
            'INSERT INTO Kho (tenKho, maThuKho) VALUES (?, ?)',
            [data.tenKho, data.maThuKho ?? null],
        );
        return { insertId: (result as any).insertId };
    }

    async update(id: number, data: { tenKho?: string; maThuKho?: number }) {
        if (data.tenKho) {
            const [check] = await this.db.query(
                'SELECT COUNT(*) as cnt FROM Kho WHERE tenKho = ? AND maKho != ?',
                [data.tenKho, id],
            );
            if ((check as any)[0].cnt > 0) {
                throw new BadRequestException('Tên kho đã tồn tại');
            }
        }

        await this.db.query(
            'UPDATE Kho SET tenKho = ?, maThuKho = ? WHERE maKho = ?',
            [data.tenKho ?? null, data.maThuKho ?? null, id],
        );
        return { message: 'Cập nhật kho thành công' };
    }

    async delete(id: number) {
        await this.db.query('DELETE FROM Kho WHERE maKho = ?', [id]);
        return { message: 'Xóa kho thành công' };
    }
}
