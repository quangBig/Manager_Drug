import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { Pool } from "mysql2/promise";

@Injectable()
export class TonKhoService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Pool) { }

    // Lấy tất cả tồn kho
    async findAll() {
        const [rows] = await this.db.query(
            `SELECT tk.*,
            t.tenThuoc,
            k.tenKho
     FROM TonKho tk
     LEFT JOIN Thuoc t ON t.maThuoc = tk.maThuoc
     LEFT JOIN Kho k ON k.maKho = tk.maKho
     ORDER BY k.tenKho, t.tenThuoc`
        );
        return rows;
    }
    // Lấy tồn kho theo kho
    async findByKho(maKho: number) {
        const [rows] = await this.db.query(
            `SELECT tk.*, 
            t.tenThuoc,
            k.tenKho 
            FROM TonKho tk 
            LEFT JOIN Thuoc t ON tk.maThuoc = t.maThuoc
            LEFT JOIN Kho k ON k.maKho = tk.maKho
            WHERE tk.maKho = ?`,
            [maKho]
        );
        return rows;
    }

    // Tạo tồn kho mới
    async create(data: {
        maKho: number;
        maThuoc: number;
        soLo?: string;
        hanSuDung?: string;
        soLuongTon: number;
        donGiaNhap: number;
    }) {
        // Kiểm tra tồn kho đã có thuốc trong kho chưa
        const [check] = await this.db.query(
            'SELECT COUNT(*) as cnt FROM TonKho WHERE maKho = ? AND maThuoc = ? AND soLo = ?',
            [data.maKho, data.maThuoc, data.soLo ?? null]
        );
        if ((check as any)[0].cnt > 0) {
            throw new BadRequestException('Thuốc này đã tồn tại trong kho với lô này');
        }

        const [result] = await this.db.query(
            `INSERT INTO TonKho 
       (maKho, maThuoc, soLo, hanSuDung, soLuongTon, donGiaNhap) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.maKho,
                data.maThuoc,
                data.soLo ?? null,
                data.hanSuDung ?? null,
                data.soLuongTon,
                data.donGiaNhap,
            ]
        );

        return { insertId: (result as any).insertId };
    }

    // Cập nhật tồn kho
    async update(
        id: number,
        data: Partial<{
            maKho: number;
            maThuoc: number;
            soLo: string;
            hanSuDung: string;
            soLuongTon: number;
            donGiaNhap: number;
        }>
    ) {
        const fields: string[] = [];
        const params: any[] = [];

        for (const key in data) {
            if (data[key] !== undefined) {
                fields.push(`${key} = ?`);
                params.push(data[key]);
            }
        }

        if (fields.length === 0) return { message: 'Không có trường nào để cập nhật' };

        params.push(id);
        await this.db.query(`UPDATE TonKho SET ${fields.join(', ')} WHERE maTonKho = ?`, params);

        return { message: 'Cập nhật tồn kho thành công' };
    }

    // Xóa tồn kho
    async delete(id: number) {
        await this.db.query('DELETE FROM TonKho WHERE maTonKho = ?', [id]);
        return { message: 'Xóa tồn kho thành công' };
    }
}
