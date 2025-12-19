/**
 * PDF Generation Utility
 * Generates order receipts with logo and order details
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface OrderItem {
  productName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  wilaya: string;
  municipality: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  status: string;
  trackingNumber?: string;
  createdAt: string;
  items: OrderItem[];
}

export async function generateOrderPDF(order: Order) {
  const doc = new jsPDF();
  
  const primaryColor: [number, number, number] = [248, 166, 176]; // #F8A6B0
  const textColor: [number, number, number] = [56, 55, 56]; // #383738
  
  let yPosition = 20;

  try {
    // Add logo
    const logoUrl = '/logo.png';
    const img = new Image();
    img.src = logoUrl;
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    // Calculate logo dimensions (max width: 40mm, maintain aspect ratio)
    const maxWidth = 40;
    const aspectRatio = img.width / img.height;
    const logoWidth = Math.min(maxWidth, img.width * 0.1);
    const logoHeight = logoWidth / aspectRatio;
    
    doc.addImage(img, 'PNG', 15, yPosition, logoWidth, logoHeight);
    yPosition += logoHeight + 10;
  } catch (error) {
    console.error('Error loading logo:', error);
    // Continue without logo
    yPosition = 20;
  }

  // Title
  doc.setFontSize(20);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('BON DE COMMANDE', 105, yPosition, { align: 'center' });
  yPosition += 12;

  // Order number and date
  doc.setFontSize(12);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(`Commande N° : ${order.orderNumber}`, 15, yPosition);
  yPosition += 7;
  
  const orderDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Date : ${orderDate}`, 15, yPosition);
  yPosition += 12;

  // Customer information section
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(15, yPosition, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text('INFORMATIONS CLIENT', 17, yPosition + 5.5);
  yPosition += 12;

  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(10);
  doc.text(`Nom : ${order.customerName}`, 15, yPosition);
  yPosition += 6;
  doc.text(`Téléphone : ${order.customerPhone}`, 15, yPosition);
  yPosition += 6;
  if (order.customerEmail) {
    doc.text(`Email : ${order.customerEmail}`, 15, yPosition);
    yPosition += 6;
  }
  doc.text(`Adresse : ${order.address}`, 15, yPosition);
  yPosition += 6;
  doc.text(`Commune : ${order.municipality}, ${order.wilaya}`, 15, yPosition);
  yPosition += 10;

  if (order.trackingNumber) {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Suivi : ${order.trackingNumber}`, 15, yPosition);
    yPosition += 10;
  }

  // Products table
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(15, yPosition, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text('DÉTAILS DE LA COMMANDE', 17, yPosition + 5.5);
  yPosition += 10;

  // Prepare table data
  const tableData = order.items.map((item) => {
    const productName = item.variantName 
      ? `${item.productName} - ${item.variantName}`
      : item.productName;
    
    return [
      productName,
      item.quantity.toString(),
      `${item.unitPrice.toFixed(2)} DA`,
      `${item.total.toFixed(2)} DA`,
    ];
  });

  // Add products table
  autoTable(doc, {
    startY: yPosition,
    head: [['Produit', 'Qté', 'Prix unitaire', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 15, right: 15 },
  });

  // Get the final Y position after the table
  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Summary box
  const summaryX = 120;
  const summaryWidth = 75;
  
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.rect(summaryX, yPosition, summaryWidth, 25);
  
  yPosition += 7;
  doc.setFontSize(10);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('Sous-total :', summaryX + 3, yPosition);
  doc.text(`${order.subtotal.toFixed(2)} DA`, summaryX + summaryWidth - 3, yPosition, { align: 'right' });
  
  yPosition += 6;
  doc.text('Frais de livraison :', summaryX + 3, yPosition);
  doc.text(`${order.shippingCost.toFixed(2)} DA`, summaryX + summaryWidth - 3, yPosition, { align: 'right' });
  
  yPosition += 8;
  doc.setFontSize(12);
  doc.setFont('bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('TOTAL :', summaryX + 3, yPosition);
  doc.text(`${order.total.toFixed(2)} DA`, summaryX + summaryWidth - 3, yPosition, { align: 'right' });

  // Footer
  yPosition = 270;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Merci pour votre commande !', 105, yPosition, { align: 'center' });
  doc.text('Darine Emballage - www.darine-emballage.com', 105, yPosition + 5, { align: 'center' });

  // Save the PDF
  doc.save(`Commande_${order.orderNumber}.pdf`);
}
