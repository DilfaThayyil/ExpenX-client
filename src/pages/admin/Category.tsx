import DataTable from "@/components/admin/DataTable";
import { manageCategory,fetchCategories } from "@/services/admin/adminServices";
import { useState } from "react";
import CategoryModal from "@/components/modals/categoryModal";
import Layout from "@/layout/Sidebar";
import { AdminNavbar } from '@/layout/AdminNav'
import { Category } from './types'


const CategoryTable = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [tableKey, setTableKey] = useState<number>(0);
  const columns = [
    { header: "Category Name", accessor: (item: Category) => item.name },
  ];
  const handleCategoryAdd = () => {
    setTableKey((prev)=>prev+1)
  };

  const actions = (item: Category) => (
    <div className="flex gap-2">
      <button
        className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded"
        onClick={() => {
          setEditingCategory(item);
          setModalOpen(true);
        }}
      >
        Edit
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
        onClick={async () => {
          await manageCategory("delete", item._id);
          setTableKey(prev => prev + 1); 
        }}
      >
        Delete
      </button>
    </div>
  );

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  return (
    <Layout role='admin'>
      <AdminNavbar />

      <div>

        <DataTable<Category>
          type="category"
          key={tableKey}
          fetchFunction={fetchCategories}
          manageFunction={manageCategory}
          columns={columns}
          actions={actions}
          onEdit={handleEdit}
        />


        {modalOpen && (
          <CategoryModal
            isOpen={modalOpen}
            closeModal={() => setModalOpen(false)}
            category={editingCategory}
            onCategoryUpdate={handleEdit}
            onCategoryAdd={handleCategoryAdd}
          />
        )}

        <button
          className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded mb-4"
          onClick={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
        >
          Add Category
        </button>
      </div>
    </Layout>
  );
};

export default CategoryTable;
