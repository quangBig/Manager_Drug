import { useState } from "react";
import Table from "../../components/Table";
import FormModal from "../../components/FormModal";

export default function ADRList() {
    const [adrs, setAdrs] = useState([
        { id: 1, maADR: "ADR01", maBenhNhan: "BN01", maThuoc: "T001", ngayXayRa: "2025-09-20", trieuChung: "Mẩn đỏ, ngứa" }
    ]);

    const [isOpen, setIsOpen] = useState(false);
    const [newADR, setNewADR] = useState({
        maADR: "", maBenhNhan: "", maThuoc: "", ngayXayRa: "", trieuChung: ""
    });

    const handleAdd = () => {
        setAdrs([...adrs, { id: Date.now(), ...newADR }]);
        setIsOpen(false);
        setNewADR({ maADR: "", maBenhNhan: "", maThuoc: "", ngayXayRa: "", trieuChung: "" });
    };

    const handleDelete = (id) => setAdrs(adrs.filter(a => a.id !== id));

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-bold">ADR</h1>
                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setIsOpen(true)}>+ Thêm</button>
            </div>
            <Table columns={["id", "maADR", "maBenhNhan", "maThuoc", "ngayXayRa", "trieuChung"]} data={adrs} onDelete={handleDelete} />
            <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="font-bold mb-2">Thêm ADR</h2>
                {Object.keys(newADR).map(f => (
                    <input key={f} className="border p-2 w-full mb-2" placeholder={f}
                        value={newADR[f]} onChange={e => setNewADR({ ...newADR, [f]: e.target.value })} />
                ))}
                <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleAdd}>Lưu</button>
            </FormModal>
        </div>
    );
}
