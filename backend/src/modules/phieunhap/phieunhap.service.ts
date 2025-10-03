import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class PhieuNhapService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Pool) { }

    // Tạo mới phiếu nhập
    async create(data: {
        ngayNhap: string;
        maNhaCungCap: number;
        maKho: number;
        maNguoiNhap: number;
    }) {
        // Kiểm tra xem đã tồn tại phiếu nhập giống hệt chưa
        const [check] = await this.db.query(
            `SELECT COUNT(*) as cnt 
     FROM PhieuNhap 
     WHERE ngayNhap = ? AND maNhaCungCap = ? AND maKho = ? AND maNguoiNhap = ?`,
            [data.ngayNhap, data.maNhaCungCap, data.maKho, data.maNguoiNhap],
        );

        if ((check as any)[0].cnt > 0) {
            throw new BadRequestException('Phiếu nhập này đã tồn tại');
        }

        // Nếu chưa có thì thêm mới
        const [result] = await this.db.query(
            `INSERT INTO PhieuNhap (ngayNhap, maNhaCungCap, maKho, maNguoiNhap) 
     VALUES (?, ?, ?, ?)`,
            [data.ngayNhap, data.maNhaCungCap, data.maKho, data.maNguoiNhap],
        );

        return { insertId: (result as any).insertId };
    }

    // Lấy tất cả phiếu nhập
    async findAll() {
        const [rows] = await this.db.query(
            `SELECT pn.*, ncc.tenNhaCungCap, k.tenKho
       FROM PhieuNhap pn
       LEFT JOIN NhaCungCap ncc ON pn.maNhaCungCap = ncc.maNhaCungCap
       LEFT JOIN Kho k ON pn.maKho = k.maKho
       ORDER BY pn.ngayNhap DESC`
        );
        return rows;
    }

    // Lấy 1 phiếu nhập theo ID
    async findOne(id: number) {
        const [rows] = await this.db.query(
            `SELECT pn.*, ncc.tenNhaCungCap, k.tenKho
       FROM PhieuNhap pn
       LEFT JOIN NhaCungCap ncc ON pn.maNhaCungCap = ncc.maNhaCungCap
       LEFT JOIN Kho k ON pn.maKho = k.maKho
       WHERE pn.maPhieuNhap = ?`,
            [id],
        );
        if ((rows as any).length === 0) {
            throw new BadRequestException('Không tìm thấy phiếu nhập');
        }
        return (rows as any)[0];
    }

    // Cập nhật phiếu nhập
    async update(
        id: number,
        data: Partial<{
            ngayNhap: string;
            maNhaCungCap: number;
            maKho: number;
            maNguoiNhap: number;
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

        if (fields.length === 0) {
            return { message: 'Không có dữ liệu để cập nhật' };
        }

        params.push(id);
        await this.db.query(
            `UPDATE PhieuNhap SET ${fields.join(', ')} WHERE maPhieuNhap = ?`,
            params,
        );

        return { message: 'Cập nhật phiếu nhập thành công' };
    }

    // Xóa phiếu nhập
    async remove(id: number) {
        await this.db.query('DELETE FROM PhieuNhap WHERE maPhieuNhap = ?', [id]);
        return { message: 'Xóa phiếu nhập thành công' };
    }
}
