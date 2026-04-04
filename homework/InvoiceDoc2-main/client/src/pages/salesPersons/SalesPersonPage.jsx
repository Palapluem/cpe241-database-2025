import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getSalesPerson, createSalesPerson, updateSalesPerson } from "../../api/salesPersons.api.js";

export default function SalesPersonPage() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    start_work_date: "",
  });

  useEffect(() => {
    if (!isNew) {
      getSalesPerson(id)
        .then((res) => {
          const data = res.data || {};
          setFormData({ 
            code: data.code || "", 
            name: data.name || "",
            start_work_date: data.start_work_date ? data.start_work_date.split('T')[0] : ""
          });
        })
        .catch((err) => {
          toast.error("Failed to load sales person.");
          navigate("/sales-persons");
        });
    }
  }, [id, isNew, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.start_work_date) payload.start_work_date = null;

      if (isNew) {
        await createSalesPerson(payload);
        toast.success("Sales Person created.");
      } else {
        await updateSalesPerson(id, payload);
        toast.success("Sales Person updated.");
      }
      navigate("/sales-persons");
    } catch (err) {
      toast.error(err.message || "Failed to save sales person");
    }
  };

  return (
    <main className="content print-full-width">
      <div className="page-header no-print">
        <h1>{isNew ? "New Sales Person" : `Edit Sales Person ${id}`}</h1>
        <div className="page-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/sales-persons")}>
            Cancel
          </button>
          <button type="submit" form="salesPersonForm" className="btn btn-primary">
            Save
          </button>
        </div>
      </div>

      <div className="card">
        <form id="salesPersonForm" onSubmit={handleSave}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Code <span className="required-marker">*</span></label>
              <input 
                name="code" 
                required 
                autoFocus 
                value={formData.code} 
                onChange={handleChange} 
                readOnly={!isNew}
                className={`form-control ${!isNew ? "readonly" : ""}`}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Name <span className="required-marker">*</span></label>
              <input 
                name="name" 
                required 
                value={formData.name} 
                onChange={handleChange} 
                className="form-control"
              />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div className="form-group">
              <label className="form-label">Start Work Date</label>
              <input 
                type="date"
                name="start_work_date" 
                value={formData.start_work_date || ""} 
                onChange={handleChange} 
                className="form-control"
              />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}