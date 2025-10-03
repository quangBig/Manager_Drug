import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';


@Injectable()
export class PhieuXuatService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Pool) { }

    async findAll() {
        const [rows] = await this.db.query(`
      SELECT px.*, k.tenKho, khoa.tenKhoa
      FROM PhieuXuat px
      LEFT JOIN Kho k ON px.maKho = k.maKho
      LEFT JOIN Khoa khoa ON px.maKhoa = khoa.maKhoa
    `);
        return rows;
    }

    async findOne(id: number) {
        const [rows] = await this.db.query(
            `SELECT px.*, k.tenKho, khoa.tenKhoa
       FROM PhieuXuat px
       LEFT JOIN Kho k ON px.maKho = k.maKho
       LEFT JOIN Khoa khoa ON px.maKhoa = khoa.maKhoa
       WHERE px.maPhieuXuat = ?`,
            [id],
        );

        if ((rows as any).length === 0) {
            throw new BadRequestException('Không tìm thấy phiếu xuất');
        }

        return (rows as any)[0];
    }

    async create(data: any) {
        const { ngayXuat, maKho, maNguoiXuat, maNguoiNhan, maKhoa } = data;
        const [result] = await this.db.query(
            `INSERT INTO PhieuXuat (ngayXuat, maKho, maNguoiXuat, maNguoiNhan, maKhoa)
       VALUES (?, ?, ?, ?, ?)`,
            [ngayXuat, maKho, maNguoiXuat, maNguoiNhan, maKhoa],
        );
        return { maPhieuXuat: (result as any).insertId, ...data };
    }

    async update(id: number, data: any) {
        const { ngayXuat, maKho, maNguoiXuat, maNguoiNhan, maKhoa } = data;
        await this.db.query(
            `UPDATE PhieuXuat SET ngayXuat=?, maKho=?, maNguoiXuat=?, maNguoiNhan=?, maKhoa=? WHERE maPhieuXuat=?`,
            [ngayXuat, maKho, maNguoiXuat, maNguoiNhan, maKhoa, id],
        );
        return { maPhieuXuat: id, ...data };
    }

    async remove(id: number) {
        await this.db.query(`DELETE FROM PhieuXuat WHERE maPhieuXuat=?`, [id]);
        return { deleted: true };
    }
}
