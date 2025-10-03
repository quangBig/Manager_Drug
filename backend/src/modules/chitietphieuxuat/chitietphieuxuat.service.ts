import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';


@Injectable()
export class ChiTietPhieuXuatService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Pool) { }

    async findAll() {
        const [rows] = await this.db.query(
            `SELECT ctx.*, t.tenThuoc, t.hoatChatChinh, t.giaNhap, t.giaBan, 
                px.ngayXuat, k.tenKho, khoa.tenKhoa
         FROM ChiTietPhieuXuat ctx
         JOIN Thuoc t ON ctx.maThuoc = t.maThuoc
         JOIN PhieuXuat px ON ctx.maPhieuXuat = px.maPhieuXuat
         JOIN Kho k ON px.maKho = k.maKho
         LEFT JOIN Khoa khoa ON px.maKhoa = khoa.maKhoa
         ORDER BY ctx.maChiTiet DESC`
        );

        return rows;
    }


    async findOne(maChiTiet: number) {
        const [rows] = await this.db.query(
            `SELECT ctx.*, t.tenThuoc, t.hoatChatChinh, t.giaNhap, t.giaBan, px.ngayXuat, k.tenKho, khoa.tenKhoa
       FROM ChiTietPhieuXuat ctx
       JOIN Thuoc t ON ctx.maThuoc = t.maThuoc
       JOIN PhieuXuat px ON ctx.maPhieuXuat = px.maPhieuXuat
       JOIN Kho k ON px.maKho = k.maKho
       LEFT JOIN Khoa khoa ON px.maKhoa = khoa.maKhoa
       WHERE ctx.maChiTiet = ?`,
            [maChiTiet],
        );

        if ((rows as any).length === 0) {
            throw new BadRequestException('Không tìm thấy chi tiết phiếu xuất');
        }

        return (rows as any)[0];
    }

    async create(data: any) {
        const { maPhieuXuat, maThuoc, soLo, hanSuDung, soLuong } = data;
        const [result] = await this.db.query(
            `INSERT INTO ChiTietPhieuXuat (maPhieuXuat, maThuoc, soLo, hanSuDung, soLuong)
       VALUES (?, ?, ?, ?, ?)`,
            [maPhieuXuat, maThuoc, soLo, hanSuDung, soLuong],
        );
        return { maChiTiet: (result as any).insertId, ...data };
    }

    async update(id: number, data: any) {
        const { soLo, hanSuDung, soLuong } = data;
        await this.db.query(
            `UPDATE ChiTietPhieuXuat SET soLo=?, hanSuDung=?, soLuong=? WHERE maChiTiet=?`,
            [soLo, hanSuDung, soLuong, id],
        );
        return { maChiTiet: id, ...data };
    }

    async remove(id: number) {
        await this.db.query(`DELETE FROM ChiTietPhieuXuat WHERE maChiTiet=?`, [id]);
        return { deleted: true };
    }
}
