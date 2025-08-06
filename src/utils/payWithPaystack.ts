// utils/payWithPaystack.ts
type PaystackParams = {
  formData: {
    name: string;
    email: string;
    regNumber: string;
    department: string;
    level: string;
  };
  totalAmount: number;
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
};

export const payWithPaystack = async ({
  formData,
  totalAmount,
  onSuccess,
  onClose,
}: PaystackParams) => {
  console.log("🚀 Paystack Form Data:", formData);

  // 🧠 Load script only once
  if (!(window as any).PaystackPop) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  const handler = (window as any).PaystackPop.setup({
    key: "pk_test_1552a9ef296e23072e0c78447a12a055adfb5cca", // 🔁 Replace with live key when ready
    email: formData.email,
    amount: totalAmount * 100, // Convert to kobo
    metadata: {
      custom_fields: [
        {
          display_name: "Full Name",
          variable_name: "name",
          value: formData.name,
        },
        {
          display_name: "Reg Number",
          variable_name: "reg_number",
          value: formData.regNumber,
        },
        {
          display_name: "Department",
          variable_name: "department",
          value: formData.department,
        },
        {
          display_name: "Level",
          variable_name: "level",
          value: formData.level,
        },
      ],
    },
    callback: function (response: any) {
      if (onSuccess) onSuccess(response.reference);
    },
    onClose: function () {
      if (onClose) onClose();
    },
  });

  handler.openIframe();
};
