import { useState } from "react";
import Table from "../../components/Table";
import FormModal from "../../components/FormModal";

export default function InventoryList() {
    const [inventories, setInventories] = useState([
        { id: 1, maTonKho: "TK01", maKho: "K01", maThuoc: "T001", soLo: "L01", hanSuDung: "2026-01-01", soLuongTon: 200, donGiaNhap: 1000 }
    ]);

    const [isOpen, setIsOpen] = useState(false);
    const [newInv, setNewInv] = useState({
        maTonKho: "", maKho: "", maThuoc: "", soLo: "", hanSuDung: "", soLuongTon: "", donGiaNhap: ""
    });

    const handleAdd = () => {
        setInventories([...inventories, { id: Date.now(), ...newInv }]);
        setIsOpen(false);
        setNewInv({ maTonKho: "", maKho: "", maThuoc: "", soLo: "", hanSuDung: "", soLuongTon: "", donGiaNhap: "" });
    };

    const handleDelete = (id) => setInventories(inventories.filter(i => i.id !== id));

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-bold">Tồn kho</h1>
                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setIsOpen(true)}>+ Thêm</button>
            </div>
            <Table columns={["id", "maTonKho", "maKho", "maThuoc", "soLo", "hanSuDung", "soLuongTon", "donGiaNhap"]} data={inventories} onDelete={handleDelete} />
            <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="font-bold mb-2">Thêm Tồn kho</h2>
                {Object.keys(newInv).map(f => (
                    <input key={f} className="border p-2 w-full mb-2" placeholder={f}
                        value={newInv[f]} onChange={e => setNewInv({ ...newInv, [f]: e.target.value })} />
                ))}
                <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleAdd}>Lưu</button>
            </FormModal>
        </div>
    );
}
