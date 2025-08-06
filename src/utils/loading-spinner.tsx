import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, LoaderCircle } from "lucide-react"

const LoadingSpinner = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="relative">
              <LoaderCircle className="h-16 w-16 text-green-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-700" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-green-800 mt-4">
              Processing Payment 
            </h3>
            <p className="text-green-600 text-center mt-2">
              Please wait while we process your payment securely 🙂🙂🙂
            </p>
            <div className="w-full bg-green-200 rounded-full h-2 mt-6">
              <div
                className="bg-green-600 h-2 rounded-full animate-pulse"
                style={{ width: "75%" }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}

export default LoadingSpinner

