import { useState } from "react";
import Table from "../../components/Table";
import FormModal from "../../components/FormModal";

export default function ExportDetail() {
    const [details, setDetails] = useState([
        { id: 1, maChiTiet: "CTX01", maPhieuXuat: "PX01", maThuoc: "T001", soLo: "L01", hanSuDung: "2026-01-01", soLuong: 50 }
    ]);

    const [isOpen, setIsOpen] = useState(false);
    const [newDetail, setNewDetail] = useState({
        maChiTiet: "", maPhieuXuat: "", maThuoc: "", soLo: "", hanSuDung: "", soLuong: ""
    });

    const handleAdd = () => {
        setDetails([...details, { id: Date.now(), ...newDetail }]);
        setIsOpen(false);
        setNewDetail({ maChiTiet: "", maPhieuXuat: "", maThuoc: "", soLo: "", hanSuDung: "", soLuong: "" });
    };

    const handleDelete = (id) => setDetails(details.filter(d => d.id !== id));

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-bold">Chi tiết Phiếu xuất</h1>
                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setIsOpen(true)}>+ Thêm</button>
            </div>
            <Table columns={["id", "maChiTiet", "maPhieuXuat", "maThuoc", "soLo", "hanSuDung", "soLuong"]} data={details} onDelete={handleDelete} />
            <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="font-bold mb-2">Thêm chi tiết xuất</h2>
                {Object.keys(newDetail).map(f => (
                    <input key={f} className="border p-2 w-full mb-2" placeholder={f}
                        value={newDetail[f]} onChange={e => setNewDetail({ ...newDetail, [f]: e.target.value })} />
                ))}
                <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleAdd}>Lưu</button>
            </FormModal>
        </div>
    );
}
