import { create } from "zustand";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

// ====== TYPE ======
export interface HangSanXuat {
    maHangSanXuat: string;
    tenHangSanXuat: string;
    quocGia?: string | null;
    diaChi?: string | null;
    dienThoai?: string | null;
    email?: string | null;
    website?: string | null;
    ghiChu?: string | null;
    trangThai?: number;
}

interface HangSanXuatStore {
    items: HangSanXuat[];
    loading: boolean;
    getItems: () => Promise<void>;
    createItem: (data: HangSanXuat) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    updateItem: (id: string, data: Partial<HangSanXuat>) => Promise<void>;
}

// ====== STORE ======
export const useHangSanXuatStore = create<HangSanXuatStore>((set, get) => ({
    items: [],
    loading: false,

    getItems: async () => {
        set({ loading: true });
        try {
            const res = await axios.get<HangSanXuat[]>("/hang-san-xuat");
            set({ items: res.data, loading: false });
        } catch (err) {
            toast.error("Không thể tải danh sách hãng sản xuất");
            set({ loading: false });
        }
    },

    createItem: async (data: HangSanXuat) => {
        set({ loading: true });
        try {
            await axios.post("/hang-san-xuat", data);
            toast.success("Thêm hãng sản xuất thành công");
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
            await axios.delete(`/hang-san-xuat/${id}`);
            toast.success("Xóa hãng sản xuất thành công");
            await get().getItems();
        } catch (err: any) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Xóa thất bại");
            }
        } finally {
            set({ loading: false });
        }
    },

    updateItem: async (id: string, data: Partial<HangSanXuat>) => {
        set({ loading: true });
        try {
            await axios.put(`/hang-san-xuat/${id}`, data);
            toast.success("Cập nhật hãng sản xuất thành công");
            await get().getItems();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Cập nhật thất bại");
        } finally {
            set({ loading: false });
        }
    },
}));
