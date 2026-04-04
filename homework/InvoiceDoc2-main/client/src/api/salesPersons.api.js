import { http } from "./http.js";

function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function listSalesPersons(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = unwrap(await http(`/api/sales-persons${query ? `?${query}` : ""}`));
  return { data: res.data, ...(res.meta || {}) };
}

export async function getSalesPerson(id) {
  return unwrap(await http(`/api/sales-persons/${id}`));
}

export async function createSalesPerson(data) {
  return unwrap(await http("/api/sales-persons", { method: "POST", body: JSON.stringify(data) }));
}

export async function updateSalesPerson(id, data) {
  return unwrap(await http(`/api/sales-persons/${id}`, { method: "PUT", body: JSON.stringify(data) }));
}

