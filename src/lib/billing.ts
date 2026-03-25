import { Stripe } from 'stripe';
import { Resend } from 'resend';
import twilio from 'twilio';

// Initialize services with dummy/env keys
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-02-24.acacia' as any,
});

export const resend = new Resend(process.env.RESEND_API_KEY || 're_mock');

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID || 'AC_mock',
  process.env.TWILIO_AUTH_TOKEN || 'mock_token'
);

export async function sendInvoiceEmail(to: string, invoiceId: string, pdfBuffer: Buffer) {
  try {
    const data = await resend.emails.send({
      from: 'Facturación WISP <facturacion@wispmanager.local>',
      to: [to],
      subject: `Nueva factura de servicio #${invoiceId}`,
      html: `<p>Hola, adjuntamos su factura mensual correspondiente al servicio de internet.</p>`,
      attachments: [
        {
          filename: `Factura_${invoiceId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
    return data;
  } catch (error) {
    console.error("Resend Error:", error);
    throw error;
  }
}

export async function sendPaymentReminderSMS(phone: string, amount: number) {
  try {
    const message = await twilioClient.messages.create({
      body: `WISP Manager: Recordatorio de pago. Tienes un saldo pendiente de $${amount}. Paga pronto para evitar cortes.`,
      from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
      to: phone,
    });
    return message.sid;
  } catch (error) {
    console.error("Twilio SMS Error:", error);
    throw error;
  }
}
