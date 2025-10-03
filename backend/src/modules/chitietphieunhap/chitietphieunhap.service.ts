import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class ChiTietPhieuNhapService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Pool) { }

    // Lấy tất cả chi tiết phiếu nhập
    async findAll() {
        const [rows] = await this.db.query(
            `SELECT ct.*, 
              t.tenThuoc, t.hoatChatChinh, t.giaNhap, t.giaBan,
              pn.ngayNhap, ncc.tenNhaCungCap, k.tenKho
       FROM ChiTietPhieuNhap ct
       JOIN Thuoc t ON ct.maThuoc = t.maThuoc
       JOIN PhieuNhap pn ON ct.maPhieuNhap = pn.maPhieuNhap
       JOIN NhaCungCap ncc ON pn.maNhaCungCap = ncc.maNhaCungCap
       JOIN Kho k ON pn.maKho = k.maKho
       ORDER BY pn.ngayNhap DESC`
        );
        return rows;
    }

    // Lấy chi tiết phiếu nhập theo maChiTiet
    async findOne(id: number) {
        const [rows] = await this.db.query(
            `SELECT ct.*, 
              t.tenThuoc, t.hoatChatChinh, t.giaNhap, t.giaBan,
              pn.ngayNhap, ncc.tenNhaCungCap, k.tenKho
       FROM ChiTietPhieuNhap ct
       JOIN Thuoc t ON ct.maThuoc = t.maThuoc
       JOIN PhieuNhap pn ON ct.maPhieuNhap = pn.maPhieuNhap
       JOIN NhaCungCap ncc ON pn.maNhaCungCap = ncc.maNhaCungCap
       JOIN Kho k ON pn.maKho = k.maKho
       WHERE ct.maChiTiet = ?`,
            [id]
        );

        if ((rows as any).length === 0) {
            throw new BadRequestException('Không tìm thấy chi tiết phiếu nhập');
        }
        return (rows as any)[0];
    }

    // Tạo mới chi tiết phiếu nhập
    async create(data: {
        maPhieuNhap: number;
        maThuoc: number;
        soLo: string;
        hanSuDung: string;
        soLuong: number;
        donGia: number;
    }) {
        // Kiểm tra phiếu nhập tồn tại
        const [checkPN] = await this.db.query(
            `SELECT maPhieuNhap FROM PhieuNhap WHERE maPhieuNhap = ?`,
            [data.maPhieuNhap],
        );
        if ((checkPN as any).length === 0) {
            throw new BadRequestException('Phiếu nhập không tồn tại');
        }

        // Kiểm tra thuốc tồn tại
        const [checkThuoc] = await this.db.query(
            `SELECT maThuoc FROM Thuoc WHERE maThuoc = ?`,
            [data.maThuoc],
        );
        if ((checkThuoc as any).length === 0) {
            throw new BadRequestException('Thuốc không tồn tại');
        }

        const [result] = await this.db.query(
            `INSERT INTO ChiTietPhieuNhap (maPhieuNhap, maThuoc, soLo, hanSuDung, soLuong, donGia)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [data.maPhieuNhap, data.maThuoc, data.soLo, data.hanSuDung, data.soLuong, data.donGia],
        );

        return { insertId: (result as any).insertId, message: 'Thêm chi tiết phiếu nhập thành công' };
    }

    // Update chi tiết phiếu nhập
    async update(id: number, data: Partial<{
        maThuoc: number;
        soLo: string;
        hanSuDung: string;
        soLuong: number;
        donGia: number;
    }>) {
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
            `UPDATE ChiTietPhieuNhap SET ${fields.join(', ')} WHERE maChiTiet = ?`,
            params,
        );

        return { message: 'Cập nhật chi tiết phiếu nhập thành công' };
    }

    // Xóa chi tiết phiếu nhập
    async remove(id: number) {
        await this.db.query(`DELETE FROM ChiTietPhieuNhap WHERE maChiTiet = ?`, [id]);
        return { message: 'Xóa chi tiết phiếu nhập thành công' };
    }
}
