import { z } from "zod";

export const CreatePaymentSchema = z.object({
  invoice_id: z.coerce.number().int().positive(),
  amount: z.coerce.number().positive(),
  payment_date: z.string().optional(), 
  method: z.string().min(1, "Payment method is required"),
  note: z.string().optional(),
});
