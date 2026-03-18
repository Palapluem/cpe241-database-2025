import { http } from "./http.js";

function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function listPayments(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = unwrap(await http(`/api/payments${query ? `?${query}` : ""}`));
  return { data: res.data, ...(res.meta || {}) };
}

export async function getPayment(id) {
  const res = unwrap(await http(`/api/payments/${id}`));
  return res.data;
}

export async function createPayment(data) {
  const res = unwrap(await http("/api/payments", {
    method: "POST",
    body: JSON.stringify(data)
  }));
  return res.data;
}

export async function updatePayment(id, data) {
  const res = unwrap(await http(`/api/payments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  }));
  return res.data;
}

export async function deletePayment(id) {
  const res = unwrap(await http(`/api/payments/${id}`, {
    method: "DELETE"
  }));
  return res.data;
}
