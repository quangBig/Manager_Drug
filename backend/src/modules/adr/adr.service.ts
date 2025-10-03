import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class AdrService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Pool) { }

    async findAll() {
        const [rows] = await this.db.query(
            `SELECT a.*, bn.hoTen as tenBenhNhan, t.tenThuoc, t.hoatChatChinh
       FROM ADR a
       LEFT JOIN BenhNhan bn ON a.maBenhNhan = bn.maBenhNhan
       LEFT JOIN Thuoc t ON a.maThuoc = t.maThuoc
       ORDER BY a.ngayXayRa DESC`
        );
        return rows;
    }

    async findOne(id: number) {
        const [rows] = await this.db.query(
            `SELECT a.*, bn.hoTen as tenBenhNhan, t.tenThuoc, t.hoatChatChinh
       FROM ADR a
       LEFT JOIN BenhNhan bn ON a.maBenhNhan = bn.maBenhNhan
       LEFT JOIN Thuoc t ON a.maThuoc = t.maThuoc
       WHERE a.maADR = ?`,
            [id],
        );

        if ((rows as any).length === 0) {
            throw new BadRequestException('Không tìm thấy ADR');
        }
        return (rows as any)[0];
    }

    async create(data: any) {
        const { maBenhNhan, maThuoc, ngayXayRa, trieuChung } = data;
        const [result] = await this.db.query(
            `INSERT INTO ADR (maBenhNhan, maThuoc, ngayXayRa, trieuChung)
       VALUES (?, ?, ?, ?)`,
            [maBenhNhan, maThuoc, ngayXayRa, trieuChung],
        );
        return { maADR: (result as any).insertId, ...data };
    }

    async update(id: number, data: any) {
        const { maBenhNhan, maThuoc, ngayXayRa, trieuChung } = data;
        await this.db.query(
            `UPDATE ADR 
       SET maBenhNhan=?, maThuoc=?, ngayXayRa=?, trieuChung=? 
       WHERE maADR=?`,
            [maBenhNhan, maThuoc, ngayXayRa, trieuChung, id],
        );
        return { maADR: id, ...data };
    }

    async remove(id: number) {
        await this.db.query(`DELETE FROM ADR WHERE maADR=?`, [id]);
        return { deleted: true };
    }
}
