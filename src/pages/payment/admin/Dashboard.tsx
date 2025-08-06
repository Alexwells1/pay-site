import { LogoutButton } from "@/components/logoutbutton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { departments, levels } from "@/constants/data";
import type { Payment } from "@/constants/types";
import { usePaymentStats } from "@/hooks/usePaymentStats";
import { API_BASE_URL } from "@/lib/api";
import axios from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import saveAs from "file-saver";

import {
  GraduationCap,
  Search,
  X,
  Download,
  TrendingUp,
  Plus,
  Users,
  ChevronDown,
  Settings,
  Bell,
  RefreshCw,
  Building2,
  FileText,
  MoreHorizontal,
  Wallet,
  Send,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  Pie,
  Cell,
  Line,
  PieChart,
  BarChart,
  LineChart,
} from "recharts";
import { toast } from "sonner";

export default function Dashboard() {
  const { stats, loading, setLoading } = usePaymentStats();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);

  // Sorting and pagination logic
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredPayments = payments.filter((payment) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      payment.fullName.toLowerCase().includes(query) ||
      payment.matricNumber.toLowerCase().includes(query) ||
      payment.email.toLowerCase().includes(query) ||
      payment.department.toLowerCase().includes(query);

    const matchesDepartment =
      selectedDepartment.length > 0
        ? selectedDepartment.includes(payment.department)
        : true;

    const matchesType = selectedType ? payment.type === selectedType : true;

    const matchesLevel =
      selectedLevel.length > 0
        ? selectedLevel.includes(payment.level.toString())
        : true;

    return matchesSearch && matchesDepartment && matchesType && matchesLevel;
  });

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/admin/payments", {
          withCredentials: true,
        });
        setPayments(res.data.data); // ✅ fix here
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [setLoading]);

  const handleViewReceipt = (paymentId: string) => {
    // Open the receipt in a new tab
    if (!paymentId) {
      toast.error("Invalid payment ID");
      return;
    }
    window.open(`${API_BASE_URL}/api/admin/receipt/${paymentId}`, "_blank");
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

 

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedDepartment.length > 0 ||
    selectedType !== "" ||
    selectedLevel.length > 0;

  // Sort payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let compare = 0;
    if (sortBy === "date") {
      compare =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === "amount") {
      compare = a.amount - b.amount;
    } else if (sortBy === "name") {
      compare = a.fullName.localeCompare(b.fullName);
    } else if (sortBy === "department") {
      compare = a.department.localeCompare(b.department);
    }
    return sortOrder === "asc" ? compare : -compare;
  });

  // Pagination
  const totalPages = Math.ceil(sortedPayments.length / pageSize);
  const paginatedPayments = sortedPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Chart Data for Department-wise Distribution
  const chartData = departments.map((dept) => {
    const totalAmount = payments
      .filter((p) => p.department === dept.name)
      .reduce((sum, p) => sum + p.amount, 0);
    return {
      department: dept.key,
      amount: totalAmount,
    };
  });

  // Pie Data for Payment Type Distribution
  const departmentalAmount = payments
    .filter((p) => p.type === "departmental")
    .reduce((sum, p) => sum + p.amount, 0);

  const collegeAmount = payments
    .filter((p) => p.type === "college")
    .reduce((sum, p) => sum + p.amount, 0);

  const pieData = [
    {
      name: "Departmental",
      value: departmentalAmount,
      color: "#0088FE",
    },
    {
      name: "College",
      value: collegeAmount,
      color: "#00C49F",
    },
  ];

  // Monthly Payment Trend Data
  const trendData = (() => {
    // Group payments by month and sum amounts
    const monthly: { [key: string]: number } = {};
    payments.forEach((p) => {
      const date = new Date(p.createdAt);
      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthly[month] = (monthly[month] || 0) + p.amount;
    });
    // Sort months chronologically
    return Object.entries(monthly)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([month, amount]) => ({ month, amount }));
  })();

  function clearFilters(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    setSearchQuery("");
    setSelectedDepartment([]);
    setSelectedType("");
    setSelectedLevel([]);
  }

  function handleRefresh(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    setLoading(true);
    axios
      .get("/admin/payments", { withCredentials: true })
      .then((res) => {
        setPayments(res.data.data);
        toast.success("Payments refreshed");
      })
      .catch((err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to refresh payments"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

   if (!stats) return <p className="p-4">Loading payment stats...</p>;
   if (stats.totalCount === 0)
     return <p className="p-4">No payment records found.</p>;

   if (loading) return <p className="p-4">Loading payments...</p>;
   if (payments.length === 0)
     return <p className="p-4">No payment records found.</p>;

  return (
    <SidebarProvider>

        {/* SIDEBAR */}
      <Sidebar className="border-r">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="flex items-center gap-2">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <GraduationCap className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">COLCOM Dues</span>
                    <span className="text-xs text-muted-foreground">
                      Admin Panel
                    </span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Search & Filters</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search by Reg. Number</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by name, matric no, email, or department"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Filter by Department</Label>
                <div className="space-y-2">
                  {departments.map((dept) => (
                    <div key={dept.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={dept.key}
                        checked={selectedDepartment.includes(dept.key)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedDepartment([
                              ...selectedDepartment,
                              dept.name,
                            ]);
                          } else {
                            setSelectedDepartment(
                              selectedDepartment.filter((d) => d !== dept.name)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={dept.key} className="text-sm font-normal">
                        {dept.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Filter by Level</Label>
                <div className="grid grid-cols-2 gap-2">
                  {levels.map((level) => (
                    <div
                      key={level.key}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={level.value}
                        checked={selectedLevel.includes(level.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedLevel([...selectedLevel, level.value]);
                          } else {
                            setSelectedLevel(
                              selectedLevel.filter((l) => l !== level.value)
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={level.value}
                        className="text-sm font-normal"
                      >
                        {level.name} Level
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Filter by Payment Type</Label>
                <div className="space-y-2">
                  {["college", "departmental"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Select
                        value={selectedType}
                        onValueChange={setSelectedType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={type}>{type}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Label htmlFor={type} className="text-sm font-normal">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full bg-transparent"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={exportFilteredCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Statistics
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Users className="mr-2 h-4 w-4" />
                    Admin User
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

{/* Main Content */}
      <SidebarInset>

        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Payment Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Manage student payments and dues
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>


        <div className="flex-1 space-y-4 p-4">

            {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">

            {/* Tabs List */}
            <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
              <TabsTrigger
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                value="overview"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                value="analytics"
              >
                Analytics
              </TabsTrigger>
            </TabsList>

{/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Statistics Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Payments
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {`₦${stats.totalAmount}`}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats.totalCount} students paid
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Departmental
                    </CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₦{stats.totalDepartmentalAmount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats.departmentalCount} students paid
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      College Payments
                    </CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {`₦${stats.totalCollegeAmount}`}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats.collegeCount} students paid
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(stats.levelBreakdown).map(
                      ([level, count]) => (
                        <CardContent className="p-6">
                          <h4 className="text-sm text-muted-foreground">
                            level {level}
                          </h4>
                          <p className="text-2xl font-bold">
                            {(count as number) || 0}
                          </p>
                        </CardContent>
                      )
                    )}
                  </div>
                </Card>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {selectedDepartment.map((dept) => (
                    <Badge key={dept} variant="secondary">
                      Dept: {dept}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() =>
                          setSelectedDepartment(
                            selectedDepartment.filter((d) => d !== dept)
                          )
                        }
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  {selectedLevel.map((level) => (
                    <Badge key={level} variant="secondary">
                      Level: {level}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() =>
                          setSelectedLevel(
                            selectedLevel.filter((l) => l !== level)
                          )
                        }
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  {selectedType && (
                    <Badge key={selectedType} variant="secondary">
                      Type: {selectedType}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => setSelectedType("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Payments Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Payments</CardTitle>
                      <CardDescription>
                        Showing {paginatedPayments.length} of{" "}
                        {sortedPayments.length} payments
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Sort by Date</SelectItem>
                          <SelectItem value="amount">Sort by Amount</SelectItem>
                          <SelectItem value="name">Sort by Name</SelectItem>
                          <SelectItem value="department">
                            Sort by Dept
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }
                      >
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reg. No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment, index) => (
                        <TableRow key={payment._id || index}>
                          <TableCell className="font-medium">
                            {payment.matricNumber}
                          </TableCell>
                          <TableCell>{payment.fullName}</TableCell>
                          <TableCell>{payment.department}</TableCell>
                          <TableCell>{payment.level}L</TableCell>
                          <TableCell>{payment.type}</TableCell>
                          <TableCell>₦{payment.amount}</TableCell>
                          <TableCell>
                            {" "}
                            {payment.createdAt
                              ? new Date(payment.createdAt).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Button
                                    onClick={() =>
                                      handleViewReceipt(payment._id)
                                    }
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    download Receipt
                                  </Button>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Button
                                    onClick={() => handleResend(payment._id)}
                                  >
                                    <Send className="mr-2 h-4 w-4" />
                                    Resend Receipt
                                  </Button>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(payment._id)}
                                  >
                                    Delete
                                  </Button>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

{/* Analytics */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="max-w-[650px]">
                  <CardHeader>
                    <CardTitle>Department-wise Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ChartContainer
                      config={{
                        amount: {
                          label: "Amount",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="max-h-[300px] w-full h-full "
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis dataKey="department" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="amount" fill="var(--color-amount)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="h-full max-w-[400px]">
                  <CardHeader>
                    <CardTitle>Payment Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[300px] max-w-[400px]">
                    <ChartContainer
                      config={{
                        departmental: {
                          label: "Departmental",
                          color: "#0088FE",
                        },
                        college: {
                          label: "College",
                          color: "#00C49F",
                        },
                      }}
                      className="h-[300px]  w-full "
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Monthly Payment Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        amount: {
                          label: "Amount",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="var(--color-amount)"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

          


          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
