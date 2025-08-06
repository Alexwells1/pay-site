import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <Button variant="outline" onClick={logoutAdmin}>
          Logout
        </Button>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}