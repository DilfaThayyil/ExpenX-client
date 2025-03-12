import { useState, useEffect } from "react";
import { manageCategory } from "@/services/admin/adminServices";
import FormInput from "@/components/InputField";
import useShowToast from "@/customHook/showToaster";

interface Category {
  _id?: string;
  name: string;
}

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  category?: Category | null;
  onCategoryUpdate: (updatedCategory: Category) => void;
  onCategoryAdd: (newCategory: Category) => void;
}

const CategoryModal: React.FC<ModalProps> = ({ 
  isOpen, 
  closeModal, 
  category, 
  onCategoryUpdate, 
  onCategoryAdd 
}) => {
  const [name, setName] = useState("");
  const Toast = useShowToast();

  useEffect(() => {
    setName(category?.name || "");
  }, [category]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Toast("Category name cannot be empty", "error", true);
      return;
    }
  
    try {
      if (category?._id) {
        const response = await manageCategory("edit", category._id, name);
        if (response && response.data) {
          onCategoryUpdate(response.data.updatedCategory || { _id: category._id, name });
          Toast("Category edited successfully", "success", true);
          closeModal();
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        const response = await manageCategory("add", "", name);
        if (response && response.data) {
          onCategoryAdd(response.data.newCategory || { _id: "temp-id", name });
          Toast("Category created successfully", "success", true);
          closeModal();
        } else {
          throw new Error("Invalid response format");
        }
      }
    } catch (error: any) {
      console.error("Error managing category:", error);
      if (error.response?.data?.error) {
        Toast(error.response.data.error, "error", true);
      } else if (error.message) {
        Toast(error.message, "error", true);
      } else {
        Toast("An unexpected error occurred", "error", true);
      }
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-full">
        <h2 className="text-xl font-semibold mb-4">{category ? "Edit" : "Add"} Category</h2>

        <FormInput
          id="categoryName"
          name="categoryName"
          type="text"
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="flex justify-end mt-6">
          <button 
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400" 
            onClick={closeModal}
          >
            Cancel
          </button>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" 
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default CategoryModal;