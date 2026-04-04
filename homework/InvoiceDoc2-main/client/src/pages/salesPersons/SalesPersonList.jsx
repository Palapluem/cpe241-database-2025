import React from "react";
import DataList from "../../components/DataList.jsx";
import { listSalesPersons } from "../../api/salesPersons.api.js";

export default function SalesPersonList() {
  const fetchData = React.useCallback((params) => listSalesPersons(params), []);

  return (
    <DataList
      title="Sales Persons"
      itemName="Sales Person"
      fetchData={fetchData}
      basePath="/sales-persons" // This routes to /sales-persons/:id
      columns={[
        { key: "code", label: "Code" },
        { key: "name", label: "Name" },
        { 
          key: "start_work_date", 
          label: "Start Work Date", 
          render: (v, row) => row.start_work_date ? new Date(row.start_work_date).toLocaleDateString() : "-" 
        },
      ]}
      hideDelete={true}
    />
  );
}