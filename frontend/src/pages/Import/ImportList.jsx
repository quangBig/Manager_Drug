import { useState } from "react";
import Table from "../../components/Table";
import FormModal from "../../components/FormModal";

export default function ImportList() {
    const [imports, setImports] = useState([
        { id: 1, maPhieuNhap: "PN01", ngayNhap: "2025-09-21", maNhaCungCap: "NCC01", maKho: "K01", maNguoiNhap: "NV01" }
    ]);

    const [isOpen, setIsOpen] = useState(false);
    const [newImport, setNewImport] = useState({
        maPhieuNhap: "", ngayNhap: "", maNhaCungCap: "", maKho: "", maNguoiNhap: ""
    });

    const handleAdd = () => {
        setImports([...imports, { id: Date.now(), ...newImport }]);
        setIsOpen(false);
        setNewImport({ maPhieuNhap: "", ngayNhap: "", maNhaCungCap: "", maKho: "", maNguoiNhap: "" });
    };

    const handleDelete = (id) => setImports(imports.filter(i => i.id !== id));

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-bold">Phiếu nhập</h1>
                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setIsOpen(true)}>+ Thêm</button>
            </div>
            <Table columns={["id", "maPhieuNhap", "ngayNhap", "maNhaCungCap", "maKho", "maNguoiNhap"]} data={imports} onDelete={handleDelete} />
            <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="font-bold mb-2">Thêm Phiếu nhập</h2>
                {Object.keys(newImport).map(f => (
                    <input key={f} className="border p-2 w-full mb-2" placeholder={f}
                        value={newImport[f]} onChange={e => setNewImport({ ...newImport, [f]: e.target.value })} />
                ))}
                <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleAdd}>Lưu</button>
            </FormModal>
        </div>
    );
}
