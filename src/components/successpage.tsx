// src/pages/SuccessPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { generateReceiptPDF } from "@/lib/receipt"; // frontend util to build PDF
import { toast } from "sonner";
import { ArrowLeft, CheckCircle } from "lucide-react";
import  { Card, CardContent } from "./ui/card";

export default function SuccessPage() {
  const navigate = useNavigate();
    const location = useLocation();
  const payment = location.state?.payment;
  const hasDownloadedRef = useRef(false);


  useEffect(() => {
    if (!payment) {
      navigate("/pay"); // Redirect if no payment data
      toast.error("No payment data found. Please try again.");
      return;
    }
  }, [payment, navigate]);

    useEffect(() => {
      if (!hasDownloadedRef.current && payment) {
        generateReceiptPDF(payment);
        hasDownloadedRef.current = true; // prevent future runs
      }
    }, [payment]);

  
   const handleDownload = async () => {
     try {
       await generateReceiptPDF(payment); // frontend PDF generation
       toast.success("Receipt downloaded");
     } catch (err) {
       console.error("Download failed", err);
       toast.error("Failed to download receipt");
     }
   };



  if (!payment) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-bold mb-4 text-green-600">
        Payment Successful 🎉
      </h2>

      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <div className="relative">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mt-4">
            Payment Successful!
          </h3>
          <p className="text-green-600 text-center mt-2">
            Your payment has been processed successfully. A receipt has been
            sent to your email.
          </p>
          <div className="w-full mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-green-700">Name:</span>
                <span className="font-semibold capitalize">
                  {payment.fullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Amount:</span>
                <span className="font-semibold">₦{payment.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Type:</span>
                <span className="font-semibold capitalize">
                  {payment.type} Fee
                </span>
              </div>

              {payment.email && (
                <div className="flex justify-between">
                  <span className="text-green-700">Email:</span>
                  <span className="font-semibold">{payment.email}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <Button onClick={handleDownload}>Download Receipt</Button>
            <Button onClick={() => navigate("/pay")} variant="outline">
              Make Another Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
