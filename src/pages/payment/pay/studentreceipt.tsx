import { useState } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PaymentLayout from "@/components/layout/layout";
import { AlertCircle, Calendar, CreditCard, Download, FileText, GraduationCap, Loader2, Mail, Search, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Payment = {
  _id: string;
  fullName: string;
  matricNumber: string;
  amount: number;
  type: string;
  department: string;
  level: string;
  createdAt: string;
  email: string;
};

export default function StudentReceipt() {



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [matric, setMatric] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  
    const [downloading, setDownloading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setHasSearched(false);


    if (!matric) return toast.error("Enter a matric number");

    setLoading(true);
    try {
      const res = await axios.get(`/payments/receipt/${matric}`);
      setPayments(res.data);

      
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || "Failed to fetch receipts");
      } else {
        toast.error("Failed to fetch receipts");
      }
      setPayments([]);
    } finally {
      setHasSearched(true);
      setLoading(false);
    }
  };




const handleDownloadResentReceipts = async (
  matricNumber: string,
  type: string
) => {
  setDownloading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/api/payments/resend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ matricNumber, type }),
    });

    if (!res.ok) {
      const errorText = await res.text(); // <-- get text, not JSON
      throw new Error(errorText || "Failed to download receipt");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt_${matricNumber}_${type}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err: unknown) {
    console.error("Resend failed:", err);
    alert(
      "Failed to download receipt. Please check the matric number and type."
    );
  }
  setDownloading(false);
};

  return (
    <PaymentLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-4  ">
        <div className="text-center mb-8 text-white/80">
          <GraduationCap className="h-12 w-12  mx-auto mb-4" />
          <h1 className="text-3xl font-bold ">Receipt Search</h1>
          <p className=" mt-2">Find and download your payment receipts</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search for Receipts
            </CardTitle>
            <CardDescription>
              Enter your matric number to find all your payment receipts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label
                htmlFor="matricNumber"
                className="text-green-700 font-medium"
              >
                Matric Number
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  name="text"
                  placeholder="Enter your matric number"
                  value={matric}
                  onChange={(e) => setMatric(e.target.value)}
                  required
                />
              </div>

              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 text-green-600 animate-spin mx-auto mb-4" />
                <p className="text-green-700">Searching for receipts...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {hasSearched && !loading && (
          <>
            {payments.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No receipts found for matric number "{matric}". Please check
                  your matric number and try again.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <Card className="border-green-200">
                  <CardHeader className="space-y-4">
                    <h2 className="text-xl font-semibold text-green-800">
                      Found {payments.length} receipt
                      {payments.length !== 1 ? "s" : ""} for{" "}
                      {payments[0].matricNumber}
                    </h2>
                  </CardHeader>
                  <Separator className="bg-green-200 "/>
                  {payments.map((payment) => (
                    <Card key={payment._id} className="border-0 shadow-none">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-green-800 flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              Receipt #{payment._id}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Transaction ID: {payment._id}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <User className="h-4 w-4" />
                              <span>Student Details</span>
                            </div>
                            <p className="font-medium text-green-900">
                              {payment.fullName}
                            </p>
                            <p className="text-sm text-green-700">
                              {payment.department}
                            </p>
                            <p className="text-sm text-green-700">
                              {payment.level}
                            </p>
                            <p className="text-sm text-green-700">
                              {" "}
                              {payment.email}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <CreditCard className="h-4 w-4" />
                              <span>Payment Details</span>
                            </div>
                            <p className="font-medium text-green-900 capitalize">
                              {payment.type} Fee
                            </p>
                            <p className="text-lg font-bold text-green-800">
                              ₦{payment.amount.toLocaleString()}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <Calendar className="h-4 w-4" />
                              <span>Payment Date</span>
                            </div>
                            <p className="font-medium text-green-900">
                              {formatDate(payment.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <Mail className="h-4 w-4" />
                            <span>Email</span>
                          </div>
                          <p className="font-medium text-green-900">
                            {payment.department}
                          </p>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex justify-end">
                          <Button
                            onClick={() =>
                              handleDownloadResentReceipts(
                                payment.matricNumber,
                                payment.type
                              )
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {downloading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Download Receipt
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </Card>
              </div>
            )}
          </>
        )}
      </div>

      <Card className="mt-8 border-green-200 bg-green-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-green-800 mb-2">Need Help?</h3>
          <div className="space-y-2 text-sm text-green-700">
            <p>
              • Make sure you enter your matric number exactly as it appears on
              your student ID
            </p>
            <p>• Receipts are available immediately after successful payment</p>
            <p>
              • If you can't find your receipt, contact the finance office at
              finance@excellenceuni.edu.ng
            </p>
            <p>
              • For technical issues, reach out to support@excellenceuni.edu.ng
            </p>
          </div>
        </CardContent>
      </Card>
    </PaymentLayout>
  );
}
