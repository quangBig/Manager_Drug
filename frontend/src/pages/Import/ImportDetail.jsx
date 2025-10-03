import { useState } from "react";
import Table from "../../components/Table";
import FormModal from "../../components/FormModal";

export default function ImportDetail() {
    const [details, setDetails] = useState([
        { id: 1, maChiTiet: "CT01", maPhieuNhap: "PN01", maThuoc: "T001", soLo: "L01", hanSuDung: "2026-12-31", soLuong: 100, donGia: 1200 }
    ]);

    const [isOpen, setIsOpen] = useState(false);
    const [newDetail, setNewDetail] = useState({
        maChiTiet: "", maPhieuNhap: "", maThuoc: "", soLo: "", hanSuDung: "", soLuong: "", donGia: ""
    });

    const handleAdd = () => {
        setDetails([...details, { id: Date.now(), ...newDetail }]);
        setIsOpen(false);
        setNewDetail({ maChiTiet: "", maPhieuNhap: "", maThuoc: "", soLo: "", hanSuDung: "", soLuong: "", donGia: "" });
    };

    const handleDelete = (id) => setDetails(details.filter(d => d.id !== id));

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-bold">Chi tiết Phiếu nhập</h1>
                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setIsOpen(true)}>+ Thêm</button>
            </div>
            <Table columns={["id", "maChiTiet", "maPhieuNhap", "maThuoc", "soLo", "hanSuDung", "soLuong", "donGia"]} data={details} onDelete={handleDelete} />
            <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="font-bold mb-2">Thêm chi tiết</h2>
                {Object.keys(newDetail).map(f => (
                    <input key={f} className="border p-2 w-full mb-2" placeholder={f}
                        value={newDetail[f]} onChange={e => setNewDetail({ ...newDetail, [f]: e.target.value })} />
                ))}
                <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleAdd}>Lưu</button>
            </FormModal>
        </div>
    );
}
