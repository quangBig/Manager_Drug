import { useState, useEffect } from "react";
import Table from "../../components/Table";
import FormModal from "../../components/FormModal";
import { useHangSanXuatStore } from "../../store/useSupplierList";
import { toast } from "react-toastify";

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
    const [sortOrder, setSortOrder] = useState("asc"); // asc | desc

    useEffect(() => { getItems(); }, []);

    // Hàm sắp xếp theo tên
    const sortByName = (a, b) => {
        const nameA = a.tenHangSanXuat?.toLowerCase() || "";
        const nameB = b.tenHangSanXuat?.toLowerCase() || "";
        return nameA.localeCompare(nameB, "vi");
    };

    // Lọc & sắp xếp danh sách
    useEffect(() => {
        const term = search.toLowerCase();
        const filtered = suppliers.filter(
            (item) =>
                item.maHangSanXuat.toLowerCase().includes(term) ||
                item.tenHangSanXuat.toLowerCase().includes(term)
        );

        const sorted = filtered.sort(sortByName);
        if (sortOrder === "desc") sorted.reverse();
        setFilteredItems(sorted);
    }, [search, suppliers, sortOrder]);

    const toggleSortOrder = () => setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));

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
        try {
            if (editingItem) {
                await updateItem(editingItem.maHangSanXuat, formData);
                toast.success("Cập nhật hãng sản xuất thành công");
            } else {
                await createItem(formData);
                toast.success("Thêm hãng sản xuất thành công");
            }
            setIsOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteItem(id);
            toast.success("Xóa thành công");
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra khi xóa");
        }
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
        trangThai: "Trạng thái"
    };

    const columnLabels = {
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
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Hãng sản xuất</h1>
                <button
                    className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg shadow"
                    onClick={openAddModal}
                >
                    + Thêm hãng sản xuất
                </button>
            </div>

            {/* Search + Sort */}
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Tìm theo mã hoặc tên hãng..."
                    className="border rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg whitespace-nowrap"
                    onClick={toggleSortOrder}
                >
                    {sortOrder === "asc" ? "⬇ A → Z" : "⬆ Z → A"}
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow p-4">
                {loading ? (
                    <p className="text-gray-500">⏳ Đang tải...</p>
                ) : (
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
                        columnLabels={columnLabels}
                        data={filteredItems}
                        onDelete={handleDelete}
                        onEdit={openEditModal}
                        renderCell={{
                            trangThai: (val) => (val === 1 ? "Còn hoạt động" : "Ngưng hoạt động"),
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
                )}
            </div>

            {/* Modal thêm/sửa */}
            <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="font-bold text-xl text-gray-800 mb-4">
                    {editingItem ? "Cập nhật hãng sản xuất" : "Thêm hãng sản xuất"}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    {Object.keys(formData).map((f) => {
                        if (f === "trangThai") return null;
                        return (
                            <div key={f} className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    {fieldLabels[f] || f}
                                </label>
                                <input
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={fieldLabels[f] || f}
                                    value={formData[f] || ""}
                                    onChange={(e) => setFormData({ ...formData, [f]: e.target.value })}
                                    disabled={editingItem && f === "maHangSanXuat"}
                                />
                            </div>
                        );
                    })}

                    {/* Trạng thái */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            {fieldLabels.trangThai}
                        </label>
                        <select
                            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.trangThai}
                            onChange={(e) =>
                                setFormData({ ...formData, trangThai: Number(e.target.value) })
                            }
                        >
                            <option value={1}>Còn hoạt động</option>
                            <option value={0}>Ngưng hoạt động</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end mt-6 gap-2">
                    <button
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                        onClick={() => setIsOpen(false)}
                    >
                        Hủy
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
                        onClick={handleSave}
                    >
                        Lưu
                    </button>
                </div>
            </FormModal>
        </div>
    );
}
