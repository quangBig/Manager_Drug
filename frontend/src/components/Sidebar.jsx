import { Link, useLocation } from "react-router-dom";
import {
    Home,
    Package,
    Truck,
    Warehouse,
    FileInput,
    FileOutput,
    ClipboardList,
    AlertTriangle,
    Layers,
} from "lucide-react";

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { path: "/", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
        { path: "/drugs", label: "Thuốc", icon: <Package className="w-5 h-5" /> },
        { path: "/drug-groups", label: "Nhóm thuốc", icon: <Layers className="w-5 h-5" /> }, // ✅ Thêm ở đây
        { path: "/suppliers", label: "Nhà cung cấp", icon: <Truck className="w-5 h-5" /> },
        { path: "/warehouses", label: "Kho", icon: <Warehouse className="w-5 h-5" /> },
        { path: "/import", label: "Phiếu nhập", icon: <FileInput className="w-5 h-5" /> },
        { path: "/import-detail", label: "Chi tiết nhập", icon: <ClipboardList className="w-5 h-5" /> },
        { path: "/export", label: "Phiếu xuất", icon: <FileOutput className="w-5 h-5" /> },
        { path: "/export-detail", label: "Chi tiết xuất", icon: <ClipboardList className="w-5 h-5" /> },
        { path: "/inventory", label: "Tồn kho", icon: <Warehouse className="w-5 h-5" /> },
        { path: "/adr", label: "ADR", icon: <AlertTriangle className="w-5 h-5" /> },
    ];

    return (
        <div className="bg-white shadow-lg w-64 min-h-screen p-4 flex flex-col">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
                <img
                    src="/benh-vien-trung-uong-quan-doi-108.gif"
                    alt="Logo"
                    className="max-h-24 w-full object-contain"
                />
            </div>

            {/* Menu */}
            <ul className="space-y-2">
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 
              ${location.pathname === item.path
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
