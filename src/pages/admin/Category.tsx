import DataTable from "@/components/admin/DataTable";
import { manageCategory } from "@/services/admin/adminServices";
import { useState, useEffect } from "react";
import CategoryModal from "@/components/modals/categoryModal";
import Layout from "@/layout/Sidebar";
import { AdminNavbar } from '@/layout/AdminNav'
import { Category } from './types'


const CategoryTable = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const columns = [
    { header: "Category Name", accessor: (item: Category) => item.name },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetchCategories()
      setCategories(response.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryAdd = (newCategory: Category) => {
    setCategories((prevCategory) => [...prevCategory, newCategory])
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
        onClick={() => manageCategory("delete", item._id)}
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
