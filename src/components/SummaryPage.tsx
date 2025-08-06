import { CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

type SummaryProps = {
  formData: any;
  onPay: (e: React.FormEvent) => void;
  onBack: () => void;
  totalAmount: number;
  paymentType: string;
};

export default function Summary({
  formData,
  onPay,
  onBack,
  totalAmount,
  paymentType,
}: SummaryProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto ">
          <div className="text-center mb-8">
          
            <h1 className="text-3xl capitalize font-bold text-green-800">
              {paymentType} Due Payment Summary
            </h1>
            <p className="text-green-600 mt-2">
              Please review your details before proceeding
            </p>
          </div>

          <Card>
            <CardContent className="space-y-4">
              <div className="grid  md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Full Name</Label>
                  <p className="font-medium">{formData.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Matric Number</Label>
                  <p className="font-medium">{formData.matricNumber}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Email</Label>
                  <p className="font-medium">{formData.email}</p>
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Department</Label>
                  <p className="font-medium">{formData.department}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Level</Label>
                  <p className="font-medium">{formData.level}</p>
                </div>
              </div>

              <Separator className="my-6 " />

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-2xl text-green-600">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4 mt-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back to Edit
            </Button>
            <Button onClick={onPay} className="flex-1">
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
