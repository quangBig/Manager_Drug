import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { Pool } from "mysql2/promise";

@Injectable()
export class ThuocService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Pool) { }

    // Lấy tất cả thuốc kèm tên nhóm và hãng
    async findAll() {
        const [rows] = await this.db.query(
            `SELECT t.*, 
            nt.tenNhomThuoc, 
            hsx.tenHangSanXuat
     FROM Thuoc t
     LEFT JOIN NhomThuoc nt ON t.maNhomThuoc = nt.maNhomThuoc
     LEFT JOIN HangSanXuat hsx ON t.maHangSanXuat = hsx.maHangSanXuat
     ORDER BY t.tenThuoc ASC`
        );
        return rows;
    }

    // Lấy 1 thuốc theo ID (kèm thông tin nhóm và hãng)
    async findOne(id: number) {
        const [rows] = await this.db.query(
            `SELECT t.*, 
            nt.tenNhomThuoc, 
            hsx.tenHangSanXuat
     FROM Thuoc t
     LEFT JOIN NhomThuoc nt ON t.maNhomThuoc = nt.maNhomThuoc
     LEFT JOIN HangSanXuat hsx ON t.maHangSanXuat = hsx.maHangSanXuat
     WHERE t.maThuoc = ?`,
            [id],
        );

        if ((rows as any).length === 0) {
            throw new BadRequestException('Không tìm thấy thuốc');
        }
        return (rows as any)[0];
    }


    // Tạo thuốc mới, check tên trùng hoặc gần giống
    async create(data: {
        tenThuoc: string;
        hoatChatChinh?: string;
        maNhomThuoc: number;
        maDonViTinh: string;
        maHangSanXuat?: number;
        giaNhap?: number;
        giaBan?: number;
        soLuongToiThieu?: number;
        soLuongToiDa?: number;
    }) {
        const [check] = await this.db.query(
            `SELECT COUNT(*) as cnt 
       FROM Thuoc 
       WHERE ? LIKE CONCAT("%", tenThuoc, "%") 
          OR tenThuoc LIKE CONCAT("%", ?, "%")`,
            [data.tenThuoc, data.tenThuoc],
        );

        if ((check as any)[0].cnt > 0) {
            throw new BadRequestException(
                'Tên thuốc đã tồn tại hoặc gần giống, vui lòng nhập tên khác',
            );
        }

        const [result] = await this.db.query(
            `INSERT INTO Thuoc 
      (tenThuoc, hoatChatChinh, maNhomThuoc, maDonViTinh, maHangSanXuat, giaNhap, giaBan, soLuongToiThieu, soLuongToiDa)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.tenThuoc,
                data.hoatChatChinh ?? null,
                data.maNhomThuoc,
                data.maDonViTinh,
                data.maHangSanXuat ?? null,
                data.giaNhap ?? 0,
                data.giaBan ?? 0,
                data.soLuongToiThieu ?? 0,
                data.soLuongToiDa ?? 0,
            ],
        );

        return { insertId: (result as any).insertId };
    }

    // Cập nhật thuốc
    async update(
        id: number,
        data: {
            tenThuoc?: string;
            hoatChatChinh?: string;
            maNhomThuoc?: number;
            maDonViTinh?: string;
            maHangSanXuat?: number;
            giaNhap?: number;
            giaBan?: number;
            soLuongToiThieu?: number;
            soLuongToiDa?: number;
        },
    ) {
        if (data.tenThuoc) {
            const [check] = await this.db.query(
                `SELECT COUNT(*) as cnt 
         FROM Thuoc 
         WHERE (? LIKE CONCAT("%", tenThuoc, "%") 
               OR tenThuoc LIKE CONCAT("%", ?, "%"))
           AND maThuoc != ?`,
                [data.tenThuoc, data.tenThuoc, id],
            );

            if ((check as any)[0].cnt > 0) {
                throw new BadRequestException(
                    'Tên thuốc đã tồn tại hoặc gần giống, vui lòng nhập tên khác',
                );
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
        await this.db.query(`UPDATE Thuoc SET ${fields.join(', ')} WHERE maThuoc = ?`, params);
        return { message: 'Cập nhật thuốc thành công' };
    }

    // Xóa thuốc
    async delete(id: number) {
        await this.db.query('DELETE FROM Thuoc WHERE maThuoc = ?', [id]);
        return { message: 'Xóa thuốc thành công' };
    }
}
