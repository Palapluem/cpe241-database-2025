import { 
  listSalesPersons, 
  getSalesPersonById, 
  createSalesPerson, 
  updateSalesPerson 
} from "../services/salesPersons.service.js";

export async function handleList(req, res) {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const result = await listSalesPersons({ search, page, limit });
    res.json({
      success: true,
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function handleGetById(req, res) {
  try {
    const data = await getSalesPersonById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.message === "Sales person not found" ? 404 : 500).json({ success: false, error: { message: err.message } });
  }
}

export async function handleCreate(req, res) {
  try {
    const data = await createSalesPerson(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function handleUpdate(req, res) {
  try {
    const data = await updateSalesPerson({ id: req.params.id, ...req.body });
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.message === "Sales person not found" ? 404 : 500).json({ success: false, error: { message: err.message } });
  }
}
