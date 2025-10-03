import { useState } from "react";
import Table from "../../components/Table";
import FormModal from "../../components/FormModal";

export default function DrugList() {
    const [drugs, setDrugs] = useState([
        {
            id: 1, maThuoc: "T001", tenThuoc: "Paracetamol", hoatChatChinh: "Acetaminophen",
            maNhomThuoc: "N01", maDonViTinh: "Viên", maHangSanXuat: "HSX01",
            giaNhap: 1000, giaBan: 2000, soLuongToiThieu: 10, soLuongToiDa: 500
        }
    ]);
    const [isOpen, setIsOpen] = useState(false);
    const [newDrug, setNewDrug] = useState({
        maThuoc: "", tenThuoc: "", hoatChatChinh: "", maNhomThuoc: "",
        maDonViTinh: "", maHangSanXuat: "", giaNhap: "", giaBan: "",
        soLuongToiThieu: "", soLuongToiDa: ""
    });

    const handleAdd = () => {
        setDrugs([...drugs, { id: Date.now(), ...newDrug }]);
        setIsOpen(false);
        setNewDrug({
            maThuoc: "", tenThuoc: "", hoatChatChinh: "", maNhomThuoc: "",
            maDonViTinh: "", maHangSanXuat: "", giaNhap: "", giaBan: "",
            soLuongToiThieu: "", soLuongToiDa: ""
        });
    };
    const handleDelete = id => setDrugs(drugs.filter(d => d.id !== id));

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-bold">Quản lý Thuốc</h1>
                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setIsOpen(true)}>+ Thêm</button>
            </div>
            <Table columns={["id", "maThuoc", "tenThuoc", "hoatChatChinh", "maNhomThuoc", "maDonViTinh", "maHangSanXuat", "giaNhap", "giaBan", "soLuongToiThieu", "soLuongToiDa"]}
                data={drugs} onDelete={handleDelete} />
            <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="font-bold mb-2">Thêm thuốc</h2>
                {Object.keys(newDrug).map(f => (
                    <input key={f} className="border p-2 w-full mb-2" placeholder={f}
                        value={newDrug[f]} onChange={e => setNewDrug({ ...newDrug, [f]: e.target.value })} />
                ))}
                <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleAdd}>Lưu</button>
            </FormModal>
        </div>
    );
}
