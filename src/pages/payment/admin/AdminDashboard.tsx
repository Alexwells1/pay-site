// src/pages/admin/AdminDashboard.tsx
import { usePaymentStats } from "@/hooks/usePaymentStats";
import { StatsCard } from "@/components/StatsCard";
import { LogoutButton } from "@/components/logoutbutton";
import PaymentsTable from "@/components/paymentstable";
import { Button } from "@/components/ui/button";



export default function AdminDashboard() {
  const { stats, loading } = usePaymentStats();

  const API_URL = "http://localhost:5000";

  const handleExportCSV = () => {
    window.open(`${API_URL}/api/admin/export`, "_blank");
  };



 


  // Handle loading and error states

  if (loading) return <p className="p-4">Loading...</p>;
  if (!stats) return <p className="p-4 text-red-500">No stats found.</p>;

  return (
    <section>
      <div>
        <div>
          <LogoutButton />
          <Button onClick={handleExportCSV} className="mb-4">
            Export as CSV
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold">Payment Statistics</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatsCard title="Total Payments" value={stats.totalCount} />
            <StatsCard title="Total Amount" value={`₦${stats.totalAmount}`} />
            <StatsCard title="College Payments" value={stats.collegeCount} />
            <StatsCard
              title="Department Payments"
              value={stats.departmentalCount}
            />
          </div>

          <h3 className="text-xl font-semibold mt-6">Breakdown by Level</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.levelBreakdown).map(([level, count]) => (
              <StatsCard
                key={level}
                title={`Level ${level}`}
                value={count as number}
              />
            ))}
          </div>

          <h3 className="text-xl font-semibold mt-6">
            Breakdown by Department
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.departmentBreakdown).map(([dept, count]) => (
              <StatsCard key={dept} title={dept} value={count as number} />
            ))}
          </div>
        </div>
        <PaymentsTable />
      </div>
    </section>
  );
}
