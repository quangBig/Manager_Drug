import { useState } from "react";
import Table from "../../components/Table";
import FormModal from "../../components/FormModal";

export default function WarehouseList() {
    const [warehouses, setWarehouses] = useState([
        { id: 1, maKho: "K01", tenKho: "Kho chính", maThuKho: "NV01" }
    ]);
    const [isOpen, setIsOpen] = useState(false);
    const [newWh, setNewWh] = useState({ maKho: "", tenKho: "", maThuKho: "" });

    const handleAdd = () => {
        setWarehouses([...warehouses, { id: Date.now(), ...newWh }]);
        setIsOpen(false);
        setNewWh({ maKho: "", tenKho: "", maThuKho: "" });
    };
    const handleDelete = id => setWarehouses(warehouses.filter(w => w.id !== id));

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-bold">Kho</h1>
                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setIsOpen(true)}>+ Thêm</button>
            </div>
            <Table columns={["id", "maKho", "tenKho", "maThuKho"]} data={warehouses} onDelete={handleDelete} />
            <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="font-bold mb-2">Thêm Kho</h2>
                {Object.keys(newWh).map(f => (
                    <input key={f} className="border p-2 w-full mb-2" placeholder={f}
                        value={newWh[f]} onChange={e => setNewWh({ ...newWh, [f]: e.target.value })} />
                ))}
                <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleAdd}>Lưu</button>
            </FormModal>
        </div>
    );
}
