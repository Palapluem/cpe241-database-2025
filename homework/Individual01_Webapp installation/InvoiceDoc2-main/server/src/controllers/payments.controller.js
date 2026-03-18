import * as paymentsService from "../services/payments.service.js";
import { CreatePaymentSchema } from "../models/payment.model.js";
import { sendList, sendOne, sendCreated, sendOk, sendError } from "../utils/response.js";
import logger from "../utils/logger.js";

export async function list(req, res) {
  try {
    const result = await paymentsService.listPayments(req.query);
    sendList(res, result);
  } catch (err) {
    logger.error("listPayments failed", { error: err?.message ?? String(err) });
    sendError(res, err?.message ?? String(err), 500);
  }
}

export async function get(req, res) {
  try {
    const id = req.params.id;
    const result = await paymentsService.getPayment(id);
    if (!result) return sendError(res, "Payment not found", 404);
    sendOne(res, result); // sendOne is likely similar to sendCreated but 200 OK.
  } catch (err) {
    logger.error("getPayment failed", { id: req.params.id, error: err?.message ?? String(err) });
    sendError(res, err?.message ?? String(err), 500);
  }
}

export async function create(req, res) {
  const parsed = CreatePaymentSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, "Validation failed", 400, "VALIDATION_ERROR", parsed.error.flatten());
  try {
    const result = await paymentsService.createPayment(parsed.data);
    sendCreated(res, result);
  } catch (err) {
    logger.error("createPayment failed", { error: err?.message ?? String(err) });
    sendError(res, err?.message ?? String(err), 500);
  }
}

export async function update(req, res) {
  const parsed = CreatePaymentSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, "Validation failed", 400, "VALIDATION_ERROR", parsed.error.flatten());
  try {
    const id = req.params.id;
    const result = await paymentsService.updatePayment(id, parsed.data);
    if (!result) return sendError(res, "Payment not found", 404);
    sendOk(res, result);
  } catch (err) {
    logger.error("updatePayment failed", { id: req.params.id, error: err?.message ?? String(err) });
    sendError(res, err?.message ?? String(err), 500);
  }
}

export async function remove(req, res) {
  try {
    const id = req.params.id;
    const result = await paymentsService.deletePayment(id);
    if (!result) return sendError(res, "Payment not found", 404);
    sendOk(res, result);
  } catch (err) {
    logger.error("deletePayment failed", { id: req.params.id, error: err?.message ?? String(err) });
    sendError(res, err?.message ?? String(err), 500);
  }
}
