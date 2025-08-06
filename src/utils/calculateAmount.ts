// utils/calculateAmount.ts
export const calculateAmount = (
  paymentType: string,
  level: string | undefined
) => {
  const processingFee = 150;
  let baseAmount = 0;

  if (!level) return { baseAmount, processingFee, totalAmount: 0 };

  if (paymentType === "college") {
    baseAmount = level === "100" || level === "DE" ? 5000 : 4000;
  } else {
    baseAmount = level === "100" || level === "DE" ? 4000 : 3000;
  }

  const totalAmount = baseAmount + processingFee;


    

  return { baseAmount, processingFee, totalAmount };
};



