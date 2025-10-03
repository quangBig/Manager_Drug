import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { Pool } from "mysql2/promise";

@Injectable()
export class NhaCungCapService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Pool) { }

    // Lấy tất cả
    async findAll() {
        const [rows] = await this.db.query('SELECT * FROM NhaCungCap');
        return rows;
    }

    // Tìm theo tên
    async findByName(id: number) {
        const [rows] = await this.db.query(
            'SELECT * FROM NhaCungCap WHERE maNhaCungCap = ?',
            [id]
        );
        return rows;
    }

    // Tạo mới
    async create(data: { tenNhaCungCap: string; diaChi?: string; dienthoai?: string }) {
        // Kiểm tra trùng tên hoặc số điện thoại
        const [check] = await this.db.query(
            'SELECT COUNT(*) as cnt FROM NhaCungCap WHERE tenNhaCungCap = ? OR dienthoai = ?',
            [data.tenNhaCungCap, data.dienthoai ?? null]
        );
        if ((check as any)[0].cnt > 0) {
            throw new BadRequestException('Tên hoặc số điện thoại nhà cung cấp đã tồn tại');
        }

        const [result] = await this.db.query(
            'INSERT INTO NhaCungCap (tenNhaCungCap, diaChi, dienthoai) VALUES (?, ?, ?)',
            [data.tenNhaCungCap, data.diaChi ?? null, data.dienthoai ?? null]
        );

        return { insertId: (result as any).insertId };
    }

    // Cập nhật
    async update(id: number, data: Partial<{ tenNhaCungCap: string; diaChi: string; dienthoai: string }>) {
        if (data.tenNhaCungCap || data.dienthoai) {
            const [check] = await this.db.query(
                `SELECT COUNT(*) as cnt FROM NhaCungCap 
         WHERE (tenNhaCungCap = ? OR dienthoai = ?) 
         AND maNhaCungCap != ?`,
                [data.tenNhaCungCap ?? null, data.dienthoai ?? null, id]
            );
            if ((check as any)[0].cnt > 0) {
                throw new BadRequestException('Tên hoặc số điện thoại nhà cung cấp đã tồn tại');
            }
        }

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
        await this.db.query(`UPDATE NhaCungCap SET ${fields.join(', ')} WHERE maNhaCungCap = ?`, params);

        return { message: 'Cập nhật nhà cung cấp thành công' };
    }

    // Xóa
    async delete(id: number) {
        await this.db.query('DELETE FROM NhaCungCap WHERE maNhaCungCap = ?', [id]);
        return { message: 'Xóa nhà cung cấp thành công' };
    }
}
