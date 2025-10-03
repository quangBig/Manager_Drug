import { useState } from "react";
import Table from "../../components/Table";
import FormModal from "../../components/FormModal";

export default function ExportList() {
    const [exports, setExports] = useState([
        { id: 1, maPhieuXuat: "PX01", ngayXuat: "2025-09-21", maKho: "K01", maNguoiXuat: "NV01", maNguoiNhan: "BN01" }
    ]);

    const [isOpen, setIsOpen] = useState(false);
    const [newExport, setNewExport] = useState({
        maPhieuXuat: "", ngayXuat: "", maKho: "", maNguoiXuat: "", maNguoiNhan: ""
    });

    const handleAdd = () => {
        setExports([...exports, { id: Date.now(), ...newExport }]);
        setIsOpen(false);
        setNewExport({ maPhieuXuat: "", ngayXuat: "", maKho: "", maNguoiXuat: "", maNguoiNhan: "" });
    };

    const handleDelete = (id) => setExports(exports.filter(e => e.id !== id));

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-bold">Phiếu xuất</h1>
                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setIsOpen(true)}>+ Thêm</button>
            </div>
            <Table columns={["id", "maPhieuXuat", "ngayXuat", "maKho", "maNguoiXuat", "maNguoiNhan"]} data={exports} onDelete={handleDelete} />
            <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="font-bold mb-2">Thêm Phiếu xuất</h2>
                {Object.keys(newExport).map(f => (
                    <input key={f} className="border p-2 w-full mb-2" placeholder={f}
                        value={newExport[f]} onChange={e => setNewExport({ ...newExport, [f]: e.target.value })} />
                ))}
                <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleAdd}>Lưu</button>
            </FormModal>
        </div>
    );
}
