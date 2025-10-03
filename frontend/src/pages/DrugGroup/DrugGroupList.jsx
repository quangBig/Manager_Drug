import { useEffect, useState } from "react";
import Table from "../../components/Table";
import FormModal from "../../components/FormModal";
import { useDrugGroupListStore } from "../../store/useDrugGroupListStore";
import { toast } from "react-toastify";

export default function DrugGroupList() {
    const { items, getItems, createItem, updateItem, deleteItem, loading } = useDrugGroupListStore();

    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null); // lưu item đang edit
    const [formData, setFormData] = useState({
        maNhomThuoc: "",
        tenNhomThuoc: "",
        maNhomCha: "",
        moTa: "",
        trangThai: 1,
    });

    const [search, setSearch] = useState("");
    const [filteredItems, setFilteredItems] = useState(items);
    const [sortAsc, setSortAsc] = useState(true); // true = A→Z, false = Z→A


    useEffect(() => {
        getItems();
    }, []);

    // Filter theo search
    useEffect(() => {
        const term = search.toLowerCase();
        const filtered = items.filter(
            (item) =>
                item.maNhomThuoc.toLowerCase().includes(term) ||
                item.tenNhomThuoc.toLowerCase().includes(term)
        );

        // Sắp xếp theo tên nhóm thuốc
        const sorted = filtered.sort((a, b) => {
            const nameA = a.tenNhomThuoc?.toLowerCase() || "";
            const nameB = b.tenNhomThuoc?.toLowerCase() || "";
            return sortAsc
                ? nameA.localeCompare(nameB, "vi")
                : nameB.localeCompare(nameA, "vi");
        });

        setFilteredItems(sorted);
    }, [search, items, sortAsc]);


    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            maNhomThuoc: "",
            tenNhomThuoc: "",
            maNhomCha: "",
            moTa: "",
            trangThai: 1,
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
                // update
                await updateItem(editingItem.maNhomThuoc, formData);
                toast.success("Cập nhật nhóm thuốc thành công");
            } else {
                // create
                await createItem(formData);
                // toast.success("Thêm nhóm thuốc thành công");
            }
            setIsOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteItem(id);
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra khi xóa nhóm thuốc");
        }
    };
    const fieldLabels = {
        maNhomThuoc: "Mã Nhóm Thuốc*(Bắt buộc)",
        tenNhomThuoc: "Tên Nhóm Thuốc*(Bắt buộc)",
        maNhomCha: "Mã Nhóm Cha*(Không bắt buộc)",
        moTa: "Mô Tả*(Không bắt buộc)",
        trangThai: "Trạng Thái",
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Nhóm thuốc</h1>
                <button
                    className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg shadow"
                    onClick={openAddModal}
                >
                    + Thêm nhóm thuốc
                </button>
            </div>

            {/* Search */}
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Tìm theo mã hoặc tên nhóm thuốc..."
                    className="border rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg whitespace-nowrap"
                    onClick={() => setSortAsc(!sortAsc)}
                >
                    {sortAsc ? "⬇ A → Z" : "⬆ Z → A"}
                </button>
            </div>


            {/* Table */}
            <div className="bg-white rounded-lg shadow p-4">
                {loading ? (
                    <p className="text-gray-500">⏳ Đang tải...</p>
                ) : (
                    <Table
                        columns={["maNhomThuoc", "tenNhomThuoc", "maNhomCha", "moTa", "trangThai"]}
                        columnLabels={{
                            maNhomThuoc: "Mã Nhóm Thuốc",
                            tenNhomThuoc: "Tên Nhóm Thuốc",
                            maNhomCha: "Mã Nhóm Cha",
                            moTa: "Mô Tả",
                            trangThai: "Trạng thái"
                        }}
                        data={filteredItems}
                        onDelete={handleDelete}
                        renderCell={{
                            trangThai: (value) => (value === 1 ? "Còn hoạt động" : "Ngưng hoạt động")
                        }}
                        onEdit={openEditModal} // thêm nút sửa
                        idField="maNhomThuoc"
                    />
                )}
            </div>


            {/* Modal thêm/sửa nhóm thuốc */}
            <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h2 className="font-bold text-xl text-gray-800 mb-4">
                    {editingItem ? "Cập nhật nhóm thuốc" : "Thêm nhóm thuốc"}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    {Object.keys(formData).map((f) => {
                        if (f === "trangThai" || f === "maNhomCha") return null; // skip 2 trường này
                        return (
                            <div key={f} className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    {fieldLabels[f] || f}
                                </label>
                                <input
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={fieldLabels[f] || f}
                                    value={formData[f]}
                                    onChange={(e) =>
                                        setFormData({ ...formData, [f]: e.target.value })
                                    }
                                    disabled={editingItem && f === "maNhomThuoc"}
                                />
                            </div>
                        );
                    })}


                    {/* Mã nhóm cha */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            {fieldLabels.maNhomCha}
                        </label>
                        <select
                            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.maNhomCha || ""}
                            onChange={(e) => setFormData({ ...formData, maNhomCha: e.target.value })}
                        >
                            <option value="">-- Không có nhóm cha --</option>
                            {items
                                .filter(
                                    (i) =>
                                        i.maNhomThuoc !== editingItem?.maNhomThuoc && // loại trừ chính nó khi edit
                                        !items.some((child) => child.maNhomCha === i.maNhomThuoc) // loại bỏ nhóm đã có con
                                )
                                .map((i) => (
                                    <option key={i.maNhomThuoc} value={i.maNhomThuoc}>
                                        {i.tenNhomThuoc} ({i.maNhomThuoc})
                                    </option>
                                ))}
                        </select>

                    </div>


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
