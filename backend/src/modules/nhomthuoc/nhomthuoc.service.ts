import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { Pool } from "mysql2/promise";

@Injectable()
export class NhomThuocService {
    constructor(@Inject('DATABASE_CONNECTION') private db: Pool) { }

    async findAll() {
        const [rows] = await this.db.query('SELECT * FROM NhomThuoc');
        return rows;
    }

    async findOne(id: string) {
        const [rows] = await this.db.query(
            'SELECT * FROM NhomThuoc WHERE maNhomThuoc = ?',
            [id],
        );
        return rows[0];
    }



    async create(data: { maNhomThuoc: string; tenNhomThuoc: string; maNhomCha?: string | null; moTa?: string; trangThai?: number }) {
        // Check tên gần giống
        const [check] = await this.db.query(
            `SELECT COUNT(*) as cnt 
             FROM NhomThuoc 
             WHERE ? LIKE CONCAT("%", tenNhomThuoc, "%") 
                OR tenNhomThuoc LIKE CONCAT("%", ?, "%")`,
            [data.tenNhomThuoc, data.tenNhomThuoc],
        );

        if ((check as any)[0].cnt > 0) {
            throw new BadRequestException("Tên nhóm thuốc đã tồn tại hoặc gần giống, vui lòng nhập tên khác");
        }
        let parent = data.maNhomCha;
        if (!parent || parent === '' || parent === 'null') {
            parent = null;
        }


        await this.db.query(
            'INSERT INTO NhomThuoc (maNhomThuoc, tenNhomThuoc, maNhomCha, moTa, trangThai) VALUES (?, ?, ?, ?, ?)',
            [
                data.maNhomThuoc,
                data.tenNhomThuoc,
                parent,
                data.moTa ?? null,
                data.trangThai ?? 1,
            ],
        );

        return { message: "Thêm nhóm thuốc thành công" };
    }

    async update(id: string, data: { tenNhomThuoc?: string; maNhomCha?: string | null; moTa?: string; trangThai?: number }) {
        if (data.tenNhomThuoc) {
            const [check] = await this.db.query(
                `SELECT COUNT(*) as cnt 
                 FROM NhomThuoc 
                 WHERE ( ? LIKE CONCAT("%", tenNhomThuoc, "%") 
                         OR tenNhomThuoc LIKE CONCAT("%", ?, "%") )
                   AND maNhomThuoc != ?`,
                [data.tenNhomThuoc, data.tenNhomThuoc, id],
            );

            if ((check as any)[0].cnt > 0) {
                throw new BadRequestException("Tên nhóm thuốc đã tồn tại hoặc gần giống, vui lòng nhập tên khác");
            }
        }

        await this.db.query(
            'UPDATE NhomThuoc SET tenNhomThuoc = ?, maNhomCha = ?, moTa = ?, trangThai = ? WHERE maNhomThuoc = ?',
            [data.tenNhomThuoc, data.maNhomCha ?? null, data.moTa ?? null, data.trangThai ?? 1, id],
        );
        return { message: "Cập nhật nhóm thuốc thành công" };
    }

    async delete(id: string) {
        const [child] = await this.db.query(
            'SELECT COUNT(*) as cnt FROM NhomThuoc WHERE maNhomCha = ?',
            [id]
        );

        if ((child as any)[0].cnt > 0) {
            throw new BadRequestException(
                'Không thể xóa nhóm thuốc cha khi còn nhóm con'
            );
        }
        await this.db.query('DELETE FROM NhomThuoc WHERE maNhomThuoc = ?', [id]);
        return { message: 'Xóa nhóm thuốc thành công' };
    }

}
