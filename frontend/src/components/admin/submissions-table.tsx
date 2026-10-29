import * as React from "react";
import { DataTable } from "@/components/submissions/data-table";
import { columns } from "@/components/submissions/columns";

export function SubmissionsTable({ data }) {
  return <DataTable data={data} columns={columns} />;
}
