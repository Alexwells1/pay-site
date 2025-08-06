import StudentDuePaymentForm from "./paymentform";
import PaymentLayout from "@/components/layout/layout";



export default function Pay(){
    return (
      
        <PaymentLayout>
          <StudentDuePaymentForm />
        </PaymentLayout>
     
    );
}