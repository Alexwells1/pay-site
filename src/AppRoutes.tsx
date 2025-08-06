import { Routes, Route} from "react-router-dom";
import AdminLogin from "./pages/payment/admin/AdminLogin";
import AdminDashboard from "./pages/payment/admin/AdminDashboard";
import PaymentSuccess from "./components/successpage";
import StudentReceipt from "./pages/payment/pay/studentreceipt";
import Dashboard from "./pages/payment/admin/Dashboard";
import Pay from "./pages/payment/pay/pay";
import ReceiptPage from "./pages/payment/receipts";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/pay" element={<Pay />} />
      <Route path="/success" element={<PaymentSuccess />} />
      <Route path="/search" element={<StudentReceipt />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="/" element={<ReceiptPage />} />
    </Routes>
  );
}
