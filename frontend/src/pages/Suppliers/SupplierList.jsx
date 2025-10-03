import { useState, useEffect } from "react";
import Table from "../../components/Table";
import FormModal from "../../components/FormModal";
import { useHangSanXuatStore } from "../../store/useSupplierList";

export default function SupplierList() {
    const { items: suppliers, getItems, createItem, updateItem, deleteItem, loading } = useHangSanXuatStore();

    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        maHangSanXuat: "",
        tenHangSanXuat: "",
        quocGia: "",
        diaChi: "",
        dienThoai: "",
        email: "",
        website: "",
        ghiChu: "",
        trangThai: 1
    });

    const [search, setSearch] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);

    // 🆕 State sắp xếp
    const [sortOrder, setSortOrder] = useState("asc"); // asc | desc

    useEffect(() => { getItems(); }, []);

    const sortByName = (a, b) => {
        const nameA = a.tenHangSanXuat?.toLowerCase() || "";
        const nameB = b.tenHangSanXuat?.toLowerCase() || "";
        return nameA.localeCompare(nameB, "vi");
    };

    useEffect(() => {
        const term = search.toLowerCase();
        const filtered = suppliers.filter(
            item =>
                item.maHangSanXuat.toLowerCase().includes(term) ||
                item.tenHangSanXuat.toLowerCase().includes(term)
        );

        const sorted = filtered.sort(sortByName);
        if (sortOrder === "desc") sorted.reverse();
        setFilteredItems(sorted);
    }, [search, suppliers, sortOrder]);

    const toggleSortOrder = () => {
        setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    };

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            maHangSanXuat: "",
            tenHangSanXuat: "",
            quocGia: "",
            diaChi: "",
            dienThoai: "",
            email: "",
            website: "",
            ghiChu: "",
            trangThai: 1
        });
        setIsOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({ ...item });
        setIsOpen(true);
    };

    const handleSave = async () => {
        if (editingItem) {
            await updateItem(editingItem.maHangSanXuat, formData);
        } else {
            await createItem(formData);
        }
        setIsOpen(false);
    };

    const handleDelete = async (id) => {
        await deleteItem(id);
    };

    const fieldLabels = {
        maHangSanXuat: "Mã hãng sản xuất*(Bắt buộc)",
        tenHangSanXuat: "Tên hãng sản xuất*(Bắt buộc)",
        quocGia: "Quốc gia*(Không bắt buộc)",
        diaChi: "Địa chỉ*(Không bắt buộc)",
        dienThoai: "Điện thoại*(Không bắt buộc)",
        email: "Email*(Không bắt buộc)",
        website: "Website*(Không bắt buộc)",
        ghiChu: "Ghi chú*(Không bắt buộc)",
        trangThai: "Trạng thái*(Bắt buộc)"
    };

    const Label = {
        maHangSanXuat: "Mã hãng sản xuất",
        tenHangSanXuat: "Tên hãng sản xuất",
        quocGia: "Quốc gia",
        diaChi: "Địa chỉ",
        dienThoai: "Điện thoại",
        email: "Email",
        website: "Website",
        ghiChu: "Ghi chú",
        trangThai: "Trạng thái"
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý Hãng sản xuất</h1>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    onClick={openAddModal}
                >
                    + Thêm hãng
                </button>
            </div>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Tìm theo mã hoặc tên hãng..."
                    className="border rounded-lg p-2 flex-1"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* 🆕 Nút sắp xếp */}
                <button
                    onClick={toggleSortOrder}
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 whitespace-nowrap"
                >
                    Sắp xếp {sortOrder === "asc" ? "A → Z" : "Z → A"}
                </button>
            </div>

            <Table
                columns={[
                    "maHangSanXuat",
                    "tenHangSanXuat",
                    "quocGia",
                    "diaChi",
                    "dienThoai",
                    "email",
                    "website",
                    "ghiChu",
                    "trangThai"
                ]}
                columnLabels={Label}
                data={filteredItems}
                onDelete={handleDelete}
                onEdit={openEditModal}
                renderCell={{
                    trangThai: val => (val === 1 ? "Còn hoạt động" : "Ngưng hoạt động"),
                    website: (val) =>
                        val ? (
                            <a
                                href={val.startsWith("http") ? val : `https://${val}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {val}
                            </a>
                        ) : "-"
                }}
                idField="maHangSanXuat"
            />

            <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="font-bold text-xl mb-4">
                    {editingItem ? "Cập nhật hãng sản xuất" : "Thêm hãng sản xuất"}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    {Object.keys(formData).map(f => {
                        if (f === "trangThai") return null;
                        return (
                            <div key={f} className="flex flex-col">
                                <label className="text-sm font-medium mb-1">{fieldLabels[f] || f}</label>
                                <input
                                    className="border rounded-lg p-2"
                                    placeholder={fieldLabels[f] || f}
                                    value={formData[f] || ""}
                                    onChange={e => setFormData({ ...formData, [f]: e.target.value })}
                                    disabled={editingItem && f === "maHangSanXuat"}
                                />
                            </div>
                        );
                    })}

                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Trạng thái</label>
                        <select
                            className="border rounded-lg p-2"
                            value={formData.trangThai}
                            onChange={e => setFormData({ ...formData, trangThai: Number(e.target.value) })}
                        >
                            <option value={1}>Còn hoạt động</option>
                            <option value={0}>Ngưng hoạt động</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end mt-6 gap-2">
                    <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={() => setIsOpen(false)}>Hủy</button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg" onClick={handleSave}>
                        {loading ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </FormModal>
        </div>
    );
}
