import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { API_BASE_URL } from "@/lib/api";
import saveAs from "file-saver";
import { Button } from "./ui/button";

type Payment = {
  _id: string;
  fullName: string;
  matricNumber: string;
  email: string;
  amount: number;
  level: string;
  department: string;
  type: string;
  createdAt: string;
};

export default function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");



const filteredPayments = payments.filter((payment) => {
  const query = searchQuery.toLowerCase();

  const matchesSearch =
    payment.fullName.toLowerCase().includes(query) ||
    payment.matricNumber.toLowerCase().includes(query) ||
    payment.email.toLowerCase().includes(query) ||
    payment.department.toLowerCase().includes(query);

  const matchesDepartment = selectedDepartment
    ? payment.department === selectedDepartment
    : true;

  const matchesType = selectedType ? payment.type === selectedType : true;

  const matchesLevel = selectedLevel
    ? payment.level.toString() === selectedLevel
    : true;

  return matchesSearch && matchesDepartment && matchesType && matchesLevel;
});




  useEffect(() => {
 const fetchPayments = async () => {
  try {
    const res = await axios.get("/admin/payments", {
      withCredentials: true,
    });
    setPayments(res.data.data); // ✅ fix here
    console.log("Payments fetched:", res.data.data);
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to fetch payments");
  } finally {
    setLoading(false);
  }
};
    fetchPayments();
  }, []);


  const handleViewReceipt = (paymentId: string) => {
   
    // Open the receipt in a new tab
    if (!paymentId) {
      toast.error("Invalid payment ID");
      return;
    }
    window.open(
      `${API_BASE_URL}/api/admin/receipt/${paymentId}`,
      "_blank"
    );
  };


  

  const exportFilteredCSV = () => {
    const rows = filteredPayments.map((payment) => ({
      Name: payment.fullName,
      Matric: payment.matricNumber,
      Email: payment.email,
      Amount: payment.amount,
      Level: payment.level,
      Department: payment.department,
      Type: payment.type,
      Date: new Date(payment.createdAt).toLocaleDateString(),
    }));

    const csvHeader = Object.keys(rows[0]).join(",") + "\n";
    const csvRows = rows.map((row) => Object.values(row).join(",")).join("\n");
    const csvContent = csvHeader + csvRows;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `filtered_payments_${Date.now()}.csv`);
  };


const handleResend = async (id: string) => {
  try {
    await axios.post(`admin/payment/${id}/resend`);
    toast.success("Receipt resent successfully");
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to resend receipt");
  }
};

const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this payment?")) return;

  try {
    await axios.delete(`admin/payment/${id}`);
    toast.success("Payment deleted");
    // Remove from local state if needed
    setPayments((prev) => prev.filter((p) => p._id !== id));
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to delete payment");
  }
};



  if (loading && payments.length === 0) {
    return <p className="p-4">Loading payments...</p>;
  }

  if (loading) return <p className="p-4">Loading payments...</p>;
  if (payments.length === 0) return <p className="p-4">No payment records found.</p>;

  return (
    <Card className="p-4 mt-6 overflow-auto">
      <div>
        <input
          type="text"
          placeholder="Search by name, matric no, email, or department"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2 border rounded w-full md:w-1/2"
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        {/* Department Filter */}
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Cyber Security">Cyber Security</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Software Engineering">Software Engineering</option>
        </select>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="college">College</option>
          <option value="departmental">Departmental</option>
        </select>

        {/* Level Filter */}
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Levels</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
        </select>
      </div>

      <Button onClick={exportFilteredCSV} className="mb-4">
        Export CSV
      </Button>

      <h2 className="text-xl font-bold mb-4">All Payments</h2>

      {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr className="text-left">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Matric No</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Level</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => {
                try {
                  return (
                    <tr key={payment._id || index} className="border-b">
                      <td className="px-4 py-2">{payment.fullName}</td>
                      <td className="px-4 py-2">{payment.matricNumber}</td>
                      <td className="px-4 py-2">{payment.email}</td>
                      <td className="px-4 py-2">₦{payment.amount}</td>
                      <td className="px-4 py-2">{payment.level}</td>
                      <td className="px-4 py-2">{payment.department}</td>
                      <td className="px-4 py-2 capitalize">{payment.type}</td>
                      <td className="px-4 py-2">
                        {payment.createdAt
                          ? new Date(payment.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleViewReceipt(payment._id)}
                          className="text-blue-600 hover:underline"
                        >
                          View Receipt
                        </button>
                      </td>

                      <td>
                        <Button onClick={() => handleResend(payment._id)}>
                          Resend Receipt
                        </Button>
                      </td>

                      <td>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(payment._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                } catch (err) {
                  console.error("💥 Error rendering payment:", payment, err);
                  return null;
                }
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
