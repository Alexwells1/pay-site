import { useEffect, useMemo, useState } from "react";


export const usePaymentState = () => {
  const [formData, setFormData] = useState({
    name: "",
    firstName: "",
    lastName: "",
    regNumber: "",
    email: "",
    department: "",
    level: "",
  });

const processingFee = 150;

const [paymentType, setPaymentType] = useState("college");

const baseAmount = useMemo(() => {
  if (!formData.level) return 0;
  if (paymentType === "college") {
    return formData.level === "100" || formData.level === "DE" ? 5000 : 4000;
  } else {
    return formData.level === "100" || formData.level === "DE" ? 4000 : 3000;
  }
}, [formData.level, paymentType]);

const totalAmount = useMemo(() => baseAmount + processingFee, [baseAmount]);


    const [success, setSuccess] = useState(() => {
      return localStorage.getItem("paymentSuccess") === "true";
    });

    useEffect(() => {
      localStorage.setItem("paymentSuccess", success ? "true" : "false");
    }, [success]);

  return {
    formData,
    setFormData,
    paymentType,
    setPaymentType,
    baseAmount,
    totalAmount,
    success,
    setSuccess
  };
};
