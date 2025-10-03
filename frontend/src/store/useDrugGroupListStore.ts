import { create } from "zustand";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

// ====== TYPE ======
export interface NhomThuoc {
    maNhomThuoc: string;
    tenNhomThuoc: string;
    maNhomCha?: string | null;
    moTa?: string;
    trangThai?: number;
}

interface DrugGroupStore {
    items: NhomThuoc[];
    loading: boolean;
    getItems: () => Promise<void>;
    createItem: (data: NhomThuoc) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    updateItem: (id: string, data: Partial<NhomThuoc>) => Promise<void>;
}

// ====== STORE ======
export const useDrugGroupListStore = create<DrugGroupStore>((set, get) => ({
    items: [],
    loading: false,

    getItems: async () => {
        set({ loading: true });
        try {
            const res = await axios.get<NhomThuoc[]>("/nhom-thuoc");
            set({ items: res.data, loading: false });
        } catch (err) {
            toast.error("Không thể tải danh sách nhóm thuốc");
            set({ loading: false });
        }
    },

    createItem: async (data: NhomThuoc) => {
        set({ loading: true });
        try {
            await axios.post("/nhom-thuoc", data);
            toast.success("Thêm nhóm thuốc thành công");
            await get().getItems();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Thêm thất bại");
        } finally {
            set({ loading: false });
        }
    },

    deleteItem: async (id: string) => {
        set({ loading: true });
        try {
            await axios.delete(`/nhom-thuoc/${id}`);
            toast.success("Xóa nhóm thuốc thành công");
            await get().getItems();
        } catch (err: any) {
            // Nếu backend trả message, hiển thị luôn
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Xóa thất bại");
            }
        } finally {
            set({ loading: false });
        }
    },


    updateItem: async (id: string, data: Partial<NhomThuoc>) => {
        set({ loading: true });
        try {
            await axios.put(`/nhom-thuoc/${id}`, data);
            // toast.success("Cập nhật thành công");
            await get().getItems();
        } catch (err) {
            toast.error("Cập nhật thất bại");
        } finally {
            set({ loading: false });
        }
    },
}));
