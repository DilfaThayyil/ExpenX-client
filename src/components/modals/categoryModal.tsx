import { useState } from "react";
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

const CategoryModal: React.FC<ModalProps> = ({ isOpen, closeModal, category, onCategoryUpdate, onCategoryAdd }) => {
  const [name, setName] = useState(category?.name || "");
  const Toast = useShowToast()

  const handleSubmit = async () => {
    if (category?._id) {
      try {
        const response = await manageCategory("edit", category._id, name);
        const updatedCategory = response.data.updatedCategory;
        onCategoryUpdate(updatedCategory);
        Toast(`Category edited successfully`, "success", true);
        closeModal();
      } catch (error) {
        console.error("Error editing category:", error);
      }
    } else {
      try {
        const response = await manageCategory("add", "", name);
        const newCategory = response.data.newCategory;
        onCategoryAdd(newCategory);
        Toast(`Category created successfully`, "success", true);
        closeModal();
      } catch (error) {
        console.error("Error creating category:", error);
      }
    }
  };
  

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl">{category ? "Edit" : "Add"} Category</h2>

        {/* Using the reusable FormInput component */}
        <FormInput
          id="categoryName"
          name="categoryName"
          type="text"
          label="Category"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-3" onClick={handleSubmit}>
          Save
        </button>
        <button className="ml-2 text-red-500" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  ) : null;
};

export default CategoryModal;
