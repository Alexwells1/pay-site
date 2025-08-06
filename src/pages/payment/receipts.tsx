import React, { useState } from "react";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";


import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Type Definitions
type PaymentMethod = "credit_card" | "debit_card" | "paypal" | "bank_transfer";
type PaymentStatus = "completed" | "pending" | "failed";

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  customer: {
    name: string;
    email: string;
  };
}

// Demo Data
const DEMO_TRANSACTION: Transaction = {
  id: `TX${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")}`,
  date: new Date(),
  amount: 125.99,
  method: "credit_card",
  status: "completed",
  customer: {
    name: "John Doe",
    email: "john.doe@example.com",
  },
};

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  transactionId: {
    fontSize: 10,
    color: "#666",
  },
  section: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderBottomStyle: "dashed",
  },
  label: {
    fontSize: 10,
    color: "#666",
  },
  value: {
    fontSize: 10,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
  statusCompleted: {
    color: "#28a745",
    fontWeight: "bold",
  },
  statusPending: {
    color: "#ffc107",
    fontWeight: "bold",
  },
  statusFailed: {
    color: "#dc3545",
    fontWeight: "bold",
  },
});

// PDF Document Component
const ReceiptPDF = ({ transaction }: { transaction: Transaction }) => (
  <Document>
    <Page size="A5" style={styles.page}>
      {/* PDF content remains the same as before */}
      <View style={styles.header}>
        <Text style={styles.title}>PAYMENT RECEIPT</Text>
        <Text style={styles.transactionId}>Transaction #{transaction.id}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CUSTOMER INFORMATION</Text>
        <Text style={styles.value}>{transaction.customer.name}</Text>
        <Text style={[styles.value, { fontSize: 9 }]}>
          {transaction.customer.email}
        </Text>
      </View>

      <View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {transaction.date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        {/* Rest of the PDF content */}
      </View>
    </Page>
  </Document>
);

// Main Component
const ReceiptPage: React.FC = () => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(receiptRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a5');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${DEMO_TRANSACTION.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-md">
        <div ref={receiptRef}></div>
        <ReceiptPDF transaction={DEMO_TRANSACTION} />
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button onClick={handleDownload}>Download PDF</button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
