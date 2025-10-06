import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { Pool } from "mysql2/promise";

@Injectable()
export class ThuocService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Pool) { }

    // 📌 Lấy tất cả thuốc kèm tên nhóm và hãng sản xuất
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

    // 📌 Lấy 1 thuốc theo mã
    async findOne(maThuoc: string) {
        const [rows] = await this.db.query(
            `SELECT t.*, 
                    nt.tenNhomThuoc, 
                    hsx.tenHangSanXuat
             FROM Thuoc t
             LEFT JOIN NhomThuoc nt ON t.maNhomThuoc = nt.maNhomThuoc
             LEFT JOIN HangSanXuat hsx ON t.maHangSanXuat = hsx.maHangSanXuat
             WHERE t.maThuoc = ?`,
            [maThuoc],
        );

        if ((rows as any).length === 0) {
            throw new BadRequestException('Không tìm thấy thuốc');
        }
        return (rows as any)[0];
    }

    // 📌 Tạo thuốc mới
    async create(data: any) {
        // 1️⃣ Kiểm tra trùng tên
        const [check] = await this.db.query(
            `SELECT COUNT(*) as cnt 
             FROM Thuoc 
             WHERE tenThuoc = ?`,
            [data.tenThuoc],
        );
        if ((check as any)[0].cnt > 0) {
            throw new BadRequestException('Tên thuốc đã tồn tại');
        }

        // 2️⃣ Sinh mã thuốc nếu chưa có
        let maThuoc = data.maThuoc;
        if (!maThuoc) {
            const [maxRow] = await this.db.query(`SELECT MAX(maThuoc) as maxCode FROM Thuoc`);
            const maxCode = (maxRow as any)[0].maxCode;
            const nextNum = maxCode ? parseInt(maxCode.replace(/\D/g, '')) + 1 : 1;
            maThuoc = 'T' + nextNum.toString().padStart(3, '0');
        }

        // 3️⃣ Insert đầy đủ trường
        await this.db.query(
            `INSERT INTO Thuoc (
                maThuoc, tenThuoc, tenThuocGeneric, hoatChatChinh,
                maNhomThuoc, maDonViTinh, maHangSanXuat,
                nongDo, dangBaoChe, quyCach,
                soLuongToiThieu, soLuongToiDa,
                giaNhap, giaBan, tyLeLoiNhuan,
                thuocKeDon, thuocGayNghien, thuocAntibiotic, duocBaoHiem, tyLeBaoHiem,
                cachBaoQuan, cachSuDung, chiDinh, chongChiDinh, tacDungPhu, tuongTac,
                ghiChu, ngayTao, nguoiTao, trangThai
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),'admin',1)`,
            [
                maThuoc,
                data.tenThuoc,
                data.tenThuocGeneric ?? null,
                data.hoatChatChinh ?? null,
                data.maNhomThuoc,
                data.maDonViTinh,
                data.maHangSanXuat ?? null,
                data.nongDo ?? null,
                data.dangBaoChe ?? null,
                data.quyCach ?? null,
                data.soLuongToiThieu ?? 0,
                data.soLuongToiDa ?? 0,
                data.giaNhap ?? 0,
                data.giaBan ?? 0,
                data.tyLeLoiNhuan ?? 0,
                data.thuocKeDon ?? 0,
                data.thuocGayNghien ?? 0,
                data.thuocAntibiotic ?? 0,
                data.duocBaoHiem ?? 0,
                data.tyLeBaoHiem ?? 0,
                data.cachBaoQuan ?? null,
                data.cachSuDung ?? null,
                data.chiDinh ?? null,
                data.chongChiDinh ?? null,
                data.tacDungPhu ?? null,
                data.tuongTac ?? null,
                data.ghiChu ?? null,
            ]
        );

        return { maThuoc };
    }

    // 📌 Cập nhật thuốc
    async update(maThuoc: string, data: any) {
        // Nếu có đổi tên thì kiểm tra trùng
        if (data.tenThuoc) {
            const [check] = await this.db.query(
                `SELECT COUNT(*) as cnt FROM Thuoc WHERE tenThuoc = ? AND maThuoc != ?`,
                [data.tenThuoc, maThuoc],
            );
            if ((check as any)[0].cnt > 0) {
                throw new BadRequestException('Tên thuốc đã tồn tại');
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

        if (fields.length === 0) {
            return { message: 'Không có trường nào để cập nhật' };
        }

        params.push(maThuoc);
        await this.db.query(`UPDATE Thuoc SET ${fields.join(', ')} WHERE maThuoc = ?`, params);
        return { message: 'Cập nhật thuốc thành công' };
    }

    // 📌 Xóa thuốc
    async delete(maThuoc: string) {
        await this.db.query('DELETE FROM Thuoc WHERE maThuoc = ?', [maThuoc]);
        return { message: 'Xóa thuốc thành công' };
    }
}
