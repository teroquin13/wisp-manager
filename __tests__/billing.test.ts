import { describe, it, expect, vi } from 'vitest';
import { sendInvoiceEmail, sendPaymentReminderSMS } from '@/lib/billing';

vi.mock('resend', () => {
  return {
    Resend: class {
      emails = { send: vi.fn().mockResolvedValue({ id: 'mock_email_id' }) }
    }
  }
});

vi.mock('twilio', () => {
  return {
    default: vi.fn().mockReturnValue({
      messages: { create: vi.fn().mockResolvedValue({ sid: 'mock_sms_id' }) }
    })
  }
});

describe('Módulo de Facturación y Notificaciones', () => {
  it('debería ejecutar la funcion de email de factura correctamente devolviendo un ID', async () => {
    const mockBuffer = Buffer.from('pdf');
    const result = await sendInvoiceEmail('test@client.com', 'INV-001', mockBuffer);
    expect(result).toHaveProperty('id', 'mock_email_id');
  });

  it('debería ejecutar el SMS de recordatorio de cobro satisfactoriamente', async () => {
    const sid = await sendPaymentReminderSMS('+123456789', 50.00);
    expect(sid).toBe('mock_sms_id');
  });
});
