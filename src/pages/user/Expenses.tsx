import Layout from "@/layout/Sidebar";
import { Table } from "antd";
import { useState } from "react";
import { ColumnType } from "antd/es/table";

// Sample mock data for the table
const mockData = [
  {
    id: 1,
    userId: "user123",
    category: "Food",
    expenseName: "Lunch at cafe",
    date: "2025-01-18",
    amount: 15.5,
  },
  {
    id: 2,
    userId: "user123",
    category: "Transport",
    expenseName: "Taxi ride",
    date: "2025-01-17",
    amount: 25.0,
  },
  {
    id: 3,
    userId: "user123",
    category: "Shopping",
    expenseName: "New shoes",
    date: "2025-01-16",
    amount: 60.0,
  },
];

export default function Expenses() {
  const [expenses, setExpenses] = useState(mockData);

  // Define table columns
  const columns: ColumnType<typeof mockData[0]>[] = [
    {
      title: "Expense ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Expense Name",
      dataIndex: "expenseName",
      key: "expenseName",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount ($)",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
  ];

  return (
    <Layout role="user">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Expenses</h1>
        <Table
          dataSource={expenses}
          columns={columns}
          rowKey="id"
          size="large"
          pagination={false}
          className="rounded-lg shadow-md border border-gray-300"
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            fontSize: "1rem", // Increase font size
          }}
        />
        <style>{`
          .ant-table-thead > tr > th {
            background: linear-gradient(to right, #10b981, #14b8a6); /* Emerald to teal gradient */
            color: white;
            font-weight: bold;
            font-size: 1.1rem;
            text-align: center;
          }
          .ant-table-tbody > tr:nth-child(odd) {
            background: #f0fdfa; /* Emerald-50 */
          }
          .ant-table-tbody > tr:hover {
            background: #d1fae5; /* Emerald-100 */
          }
          .ant-table-tbody > tr > td {
            font-size: 1rem; /* Adjust font size */
            text-align: center;
          }
          .ant-table-tbody > tr > td:nth-child(6) {
            font-weight: bold;
            color: #059669; /* Emerald-600 for amounts */
          }
        `}</style>
      </div>
    </Layout>
  );
}
