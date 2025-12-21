/**
 * Email Utility using Nodemailer
 * Sends order notifications to admin
 */

import nodemailer from 'nodemailer';

// Email configuration from environment variables
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'your-app-password';
const ADMIN_EMAIL = 'nj_sid@esi.dz';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou autre service (outlook, yahoo, etc.)
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

interface OrderItem {
  productName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  wilaya: string;
  municipality: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
}

/**
 * Send order notification email to admin
 */
export async function sendOrderNotification(order: OrderData): Promise<boolean> {
  try {
    // Generate items HTML
    const itemsHTML = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">
            ${item.productName}${item.variantName ? ` - ${item.variantName}` : ''}
          </td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">
            ${item.unitPrice.toFixed(0)} DA
          </td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">
            ${item.total.toFixed(0)} DA
          </td>
        </tr>
      `
      )
      .join('');

    // Email HTML template
    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #F8A6B0;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #fff;
              padding: 20px;
              border: 1px solid #ddd;
              border-top: none;
            }
            .info-section {
              margin-bottom: 20px;
              padding: 15px;
              background-color: #f9f9f9;
              border-radius: 5px;
            }
            .info-section h3 {
              margin-top: 0;
              color: #F8A6B0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            th {
              background-color: #F8A6B0;
              color: white;
              padding: 10px;
              text-align: left;
            }
            .summary {
              margin-top: 20px;
              padding: 15px;
              background-color: #f0f0f0;
              border-radius: 5px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
            }
            .total {
              font-size: 1.2em;
              font-weight: bold;
              color: #F8A6B0;
              border-top: 2px solid #F8A6B0;
              padding-top: 10px;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Nouvelle Commande Reçue !</h1>
            </div>
            <div class="content">
              <p><strong>Commande N° :</strong> ${order.orderNumber}</p>
              ${order.trackingNumber ? `<p><strong>Tracking :</strong> ${order.trackingNumber}</p>` : ''}
              
              <div class="info-section">
                <h3>📋 Informations Client</h3>
                <p><strong>Nom :</strong> ${order.customerName}</p>
                <p><strong>Téléphone :</strong> ${order.customerPhone}</p>
                ${order.customerEmail ? `<p><strong>Email :</strong> ${order.customerEmail}</p>` : ''}
                <p><strong>Adresse :</strong> ${order.address}</p>
                <p><strong>Commune :</strong> ${order.municipality}</p>
                <p><strong>Wilaya :</strong> ${order.wilaya}</p>
              </div>

              <div class="info-section">
                <h3>🛒 Détails de la Commande</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th style="text-align: center;">Quantité</th>
                      <th style="text-align: right;">Prix unitaire</th>
                      <th style="text-align: right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHTML}
                  </tbody>
                </table>
              </div>

              <div class="summary">
                <div class="summary-row">
                  <span>Sous-total :</span>
                  <span>${order.subtotal.toFixed(0)} DA</span>
                </div>
                <div class="summary-row">
                  <span>Frais de livraison :</span>
                  <span>${order.shippingCost.toFixed(0)} DA</span>
                </div>
                <div class="summary-row total">
                  <span>TOTAL :</span>
                  <span>${order.total.toFixed(0)} DA</span>
                </div>
              </div>

              <p style="margin-top: 20px; text-align: center; color: #666;">
                <em>Cette commande a été créée sur Darine Emballage</em>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Darine Emballage" <${EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `🛒 Nouvelle commande ${order.orderNumber}`,
      html: emailHTML,
    });

    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
