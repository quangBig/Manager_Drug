import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DrugList from "./pages/Drugs/DrugList";
import SupplierList from "./pages/Suppliers/SupplierList";
import WarehouseList from "./pages/Warehouses/WarehouseList";
import ImportList from "./pages/Import/ImportList";
import ImportDetail from "./pages/Import/ImportDetail";
import ExportList from "./pages/Export/ExportList";
import ExportDetail from "./pages/Export/ExportDetail";
import InventoryList from "./pages/Inventory/InverntoryList";
import ADRList from "./pages/ADR/ADRList";
import LoginPage from "./pages/Auth/Login";
import DrugGroupList from "./pages/DrugGroup/DrugGroupList";

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/drugs" element={<DrugList />} />
            <Route path="/drug-groups" element={<DrugGroupList />} />
            <Route path="/suppliers" element={<SupplierList />} />
            <Route path="/warehouses" element={<WarehouseList />} />
            <Route path="/import" element={<ImportList />} />
            <Route path="/import-detail" element={<ImportDetail />} />
            <Route path="/export" element={<ExportList />} />
            <Route path="/export-detail" element={<ExportDetail />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/adr" element={<ADRList />} />
          </Routes>
        </div>
      </div>
      {/* Đây là chỗ quan trọng để toast hiển thị */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}
