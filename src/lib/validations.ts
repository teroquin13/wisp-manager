import { z } from 'zod';

export const ClienteSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Debe ser un correo electrónico válido").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const RouterSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  ipAddress: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, "Debe ser una dirección IP válida"),
  apiUser: z.string().min(1, "El usuario no puede estar vacío"),
  apiPass: z.string().min(1, "La contraseña no puede estar vacía"),
  location: z.string().optional(),
});

export const PlanSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  price: z.number().positive("El precio debe ser mayor a 0"),
  downloadKb: z.number().positive("Debe ser mayor a 0"),
  uploadKb: z.number().positive("Debe ser mayor a 0"),
});

export const ContratoSchema = z.object({
  customerId: z.string().uuid("ID de cliente inválido"),
  planId: z.string().uuid("ID de plan inválido"),
  routerNodeId: z.string().uuid("ID de router inválido"),
  ipAddress: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, "Debe ser una dirección IP válida").optional().nullable(),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Formato MAC inválido").optional().nullable(),
  status: z.enum(["ACTIVE", "SUSPENDED", "CANCELLED"]).default("ACTIVE"),
});

export const FacturaSchema = z.object({
  customerId: z.string().uuid("ID de cliente inválido"),
  amount: z.number().positive("El monto debe ser mayor a 0"),
  status: z.enum(["PENDING", "PAID", "OVERDUE"]).default("PENDING"),
  dueDate: z.coerce.date(),
});

export const PagoSchema = z.object({
  invoiceId: z.string().uuid("ID de factura inválido"),
  customerId: z.string().uuid("ID de cliente inválido"),
  amount: z.number().positive("El monto debe ser mayor a 0"),
  method: z.enum(["CASH", "STRIPE", "TRANSFER", "BANK_TRANSFER"]).default("CASH"),
});
