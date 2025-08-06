// src/lib/receipt.ts
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

const collegeInfo = {
  name: "COLCOM",
  logoPath: "/images/logo.png",
  color: rgb(0, 0.5, 0.2),
};

export async function generateReceiptPDF(payment: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const greenColor = rgb(0.2, 0.6, 0.2);
  const blackColor = rgb(0, 0, 0);
  const grayColor = rgb(0.5, 0.5, 0.5);

  // Watermark
  page.drawText("COLCOM", {
    x: width / 2 - 100,
    y: height / 2,
    size: 60,
    font: boldFont,
    color: rgb(0.95, 0.95, 0.95),
    rotate: degrees(-30),
  });

  // === Logo ===
  try {
    const logoImageBytes = await fetch(collegeInfo.logoPath).then((res) =>
      res.arrayBuffer()
    );
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoDims = logoImage.scale(0.2);

    page.drawImage(logoImage, {
      x: 60,
      y: height - 100,
      width: logoDims.width,
      height: logoDims.height,
    });
  } catch (e) {
    console.warn("Logo load failed:", e);
  }
  // Header
  page.drawText("COLLEGE OF COMPUTING (COLCOM)", {
    x: width / 2 - 120,
    y: height - 80,
    size: 16,
    font: boldFont,
    color: greenColor,
  });

  page.drawText("PAYMENT RECEIPT", {
    x: width / 2 - 60,
    y: height - 110,
    size: 14,
    font: boldFont,
    color: blackColor,
  });

  // Line separator
  page.drawLine({
    start: { x: 80, y: height - 140 },
    end: { x: width - 80, y: height - 140 },
    thickness: 1,
    color: greenColor,
  });

  // Student details
  let y = height - 200;

  page.drawText("Student Name:", {
    x: 100,
    y: y,
    size: 12,
    font: regularFont,
    color: blackColor,
  });
  page.drawText(payment.fullName, {
    x: 250,
    y: y,
    size: 12,
    font: boldFont,
    color: blackColor,
  });

  y -= 40;
  page.drawText("Level:", {
    x: 100,
    y: y,
    size: 12,
    font: regularFont,
    color: blackColor,
  });
  page.drawText(payment.level, {
    x: 250,
    y: y,
    size: 12,
    font: boldFont,
    color: blackColor,
  });

  y -= 40;
  page.drawText("Matric Number:", {
    x: 100,
    y: y,
    size: 12,
    font: regularFont,
    color: blackColor,
  });
  page.drawText(payment.matricNumber, {
    x: 250,
    y: y,
    size: 12,
    font: boldFont,
    color: blackColor,
  });

  y -= 40;
  page.drawText("Payment Date:", {
    x: 100,
    y: y,
    size: 12,
    font: regularFont,
    color: blackColor,
  });
  page.drawText(new Date(payment.createdAt).toLocaleString(), {
    x: 250,
    y: y,
    size: 12,
    font: boldFont,
    color: blackColor,
  });

  page.drawText("Department:", {
    x: 100,
    y: y - 40,
    size: 12,
    font: regularFont,
    color: blackColor,
  });
  page.drawText(payment.department, {
    x: 250,
    y: y - 40,
    size: 12,
    font: boldFont,
    color: blackColor,
  });

  page.drawText("Email:", {
    x: 100,
    y: y - 80,
    size: 12,
    font: regularFont,
    color: blackColor,
  });
  page.drawText(payment.email || "N/A", {
    x: 250,
    y: y - 80,
    size: 12,
    font: boldFont,
    color: blackColor,
  });

  // Amount section
  y -= 100;
  page.drawRectangle({
    x: 80,
    y: y - 19,
    width: width - 160,
    height: 60,
    color: rgb(0.95, 1, 0.95),
    borderColor: greenColor,
    borderWidth: 1,
  });

  page.drawText("Amount Paid:", {
    x: 100,
    y: y,
    size: 14,
    font: regularFont,
    color: blackColor,
  });
  page.drawText(`NGN${payment.amount}`, {
    x: width - 180,
    y: y,
    size: 18,
    font: boldFont,
    color: greenColor,
  });

 

  // === Footer Notes ===
  page.drawText("Keep this receipt safe. It serves as proof of your payment.", {
    x: 60,
    y: 60,
    size: 9,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  page.drawText("This receipt confirms payment of dues .", {
    x: 60,
    y: 48,
    size: 9,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // === Stamp/Box ===
  // Stamp box
  page.drawRectangle({
    x: width - 200,
    y: 100,
    width: 150,
    height: 80,
    borderColor: blackColor,
    borderWidth: 2,
  });


  // === Save PDF ===
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  saveAs(blob, `receipt_${payment.matricNumber}_${Date.now()}.pdf`);
}
