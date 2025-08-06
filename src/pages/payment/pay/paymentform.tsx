import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Hash } from "lucide-react";
import { Building2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import StudentPaymentForm from "./StudentPaymentForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "@/lib/axios";
import { paymentSchema } from "@/lib/schema";
import LoadingSpinner from "@/utils/loading-spinner";
import Summary from "@/components/SummaryPage";


type PaymentFormData = {
  fullName: string;
  lastName: string;
  firstName: string;
  matricNumber: string;
  email: string;
  department: string;
  level: string;
  type: string;
  amount: number;
};


export default function StudentDuePaymentForm() {
  const navigate = useNavigate();



  const [loading, setLoading] = useState(false);

  const [showSummary, setShowSummary] = useState(false);

  const [formData, setFormData] = useState<PaymentFormData>({
    fullName: "",
    lastName: "",
    firstName: "",
    matricNumber: "",
    email: "",
    department: "",
    level: "",
    type: "college",
    amount: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // Dynamically update fullName when firstName or lastName changes
      if (name === "firstName" || name === "lastName") {
        updated.fullName = `${updated.firstName} ${updated.lastName}`.trim();
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);

    console.log("Form submitted with:", formData);
    console.log("form props");
    e.preventDefault();

    const data = {
      fullName: formData.fullName,
      matricNumber: formData.matricNumber,
      email: formData.email,
      department: formData.department,
      level: formData.level,
      type: formData.type,
      amount: formData.amount,
    };
    try {
      paymentSchema.parse(data);

      const res = await axios.post("/payments", data);
      const { payment } = res.data;
      toast.success("Payment successful! 🎉");
      navigate("/success", { state: { payment } });
     setFormData({
       fullName: "",
       lastName: "",
       firstName: "",
       matricNumber: "",
       email: "",
       department: "",
       level: "",
       type: "college",
       amount: 0,
     });
    } catch (err: any) {
  if (err.name === "ZodError") {
    toast.error(err.errors?.[0]?.message || "Invalid input");
  } else {
    toast.error(err.response?.data?.message || "Payment failed");
  }
      
        setLoading(false);
        
      
    }
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  const handleConfirmPayment = () => {
    
    setShowSummary(true);
    
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (showSummary) {
    return (
      <Summary
        formData={formData}
        onBack={() => setShowSummary(false)}
        onPay={handleSubmit}
        totalAmount={formData.amount}
        paymentType={formData.type}
      />
    );
  }

  

  return (
    <main className="min-h-screen flex flex-col items-center justify-center ">
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex flex-col lg:flex-row justify-center items-center md:gap-4">
          <div className="flex flex-col  justify-between px-4 sm:px-6 py-5 md:py-10 gap-4 md:gap-6">
            {/* Text */}
            <div className="text-white text-center lg:text-left max-w-xl space-y-1 md:space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight uppercase leading-tight">
                Pay Your COLCOM Dues
              </h1>

              <p className="text-sm sm:text-base md:hidden text-white/70">
                Fast, secure, and stress-free.
              </p>

              <p className="hidden md:block text-base md:text-lg text-white/70 leading-relaxed">
                Welcome to the official COLCOM dues portal. Pay your
                departmental and college dues securely, without queues or
                delays. Enter your details carefully and download your receipt
                instantly.
              </p>
            </div>

            {/* Logo + Org Info */}
            <div className="hidden md:flex items-center gap-3 text-white">
              <img
                src="/logo.svg"
                alt="COLCOM Logo"
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                  COLCOM, FUNAAB
                </h3>
                <p className="text-sm sm:text-base text-white/70">
                  NACOS — College of Computing
                </p>
              </div>
            </div>
          </div>

          <Card className=" bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl  md:p-10 shadow-xl w-full max-w-xl text-white space-y-6">
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Payment Type</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="college"
                      id="college"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="college"
                      className="flex flex-col items-center border-2 p-4 rounded-md cursor-pointer transition-colors hover:bg-white/10 peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary peer-data-[state=checked]:ring-offset-2"
                    >
                      <Building2 className="mb-3 h-6 w-6" />
                      College Dues
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="departmental"
                      id="departmental"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="departmental"
                      className="flex flex-col items-center border-2 p-4 rounded-md cursor-pointer transition-colors hover:bg-white/10 peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary peer-data-[state=checked]:ring-offset-2"
                    >
                      <Hash className="mb-3 h-6 w-6" />
                      Departmental Dues
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <StudentPaymentForm
                handleChange={handleChange}
                handleSubmit={handleConfirmPayment}
                setFormData={setFormData}
                formData={formData}
                handlenameChange={handlenameChange}
              
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
