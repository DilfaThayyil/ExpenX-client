import { useEffect, useState } from "react";
import Table from "@/components/admin/Table";
import Pagination from "@/components/admin/Pagination";
import useShowToast from "@/customHook/showToaster";
import Loading from "@/style/loading";
import { Pencil, Trash } from "lucide-react";
import { fetchUsers, fetchAdvisors, fetchCategories, manageUser, manageCategory } from "@/services/admin/adminServices";
import CategoryModal from "../modals/categoryModal";



interface DataTableProps<T> {
  type: "user" | "advisor" | "category";
  onEdit?: (item:any)=>void
}

const DataTable = <T,>({ type }: DataTableProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(3);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null)
  const limit = 4;
  const Toast = useShowToast();

  
  const fetchFunction = async (page: number, limit: number) => {
    switch (type) {
      case "user":
        return await fetchUsers(page, limit);
      case "advisor":
        return await fetchAdvisors(page, limit);
      case "category":
        return await fetchCategories(page, limit);
      default:
        throw new Error("Invalid type");
    }
  };

  const manageFunction = async (action: string, id: string) => {
    if (type === "user" || type === "advisor") {
      return await manageUser(action, type, id);
    }
    if (type === "category") {
      return await manageCategory(action, id);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchFunction(currentPage, limit);
        console.log("response : ", response)
        if (type === 'category') {
          setData(Array.isArray(response.data.categories) ? response.data.categories : [])
        } else {
          setData(Array.isArray(response.data.users) ? response.data.users : []);
        }
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch ${type}s`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, currentPage]);

  const handleAction = async (action: string, id: string) => {
    if (action === "edit" && type === "category") {
      const categoryToEdit = data.find((item: any) => item._id === id);
      setSelectedCategory(categoryToEdit);
      setModalOpen(true);
      return;
    }
  
    try {
      console.log("action-id : ", action, "--", id);
      const response = await manageFunction(action, id);
      console.log("response :", response);
      Toast(`${type} ${action}ed successfully`, "success", true);
  
      if (action === "delete") {
        setData(data.filter((item: any) => item._id !== id));
      }
    } catch (err) {
      console.log(err);
      Toast(`Failed to ${action} the ${type}`, "error", true);
    }
  };

  const handleBlock = async (action: string,type:'user'|'advisor', email: string)=>{
    try{
      const response = await manageUser(action,type,email)
      console.log("response :",response)
      setData((prevData) =>
        prevData.map((item: any) =>
          item.email === email ? { ...item, isBlocked: action === "block" } : item
        )
      );      
      Toast(`${type} ${action}ed successfully`,'success',true)
    }catch(err){
      console.error(err)
      Toast(`Failed to ${action} the ${type}`,'error',true)
    }
  }

  const handleCategoryUpdate = (updatedCategory:any)=>{
    setData((prevData) =>
      prevData.map((item: any) =>
        item._id === updatedCategory._id ? updatedCategory : item
      )
    );
  }

  const handleCategoryAdd = (newCategory:any)=>{
    setData((prev)=>[...prev,newCategory])
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto px-20 mt-7">
      <input
        type="text"
        className="p-2 border border-gray-300 rounded-lg w-full mb-2"
        placeholder={`Search ${type}`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Table<T>
        data={data.filter((item: any) =>
          JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
        )}
        columns={
          type === "category"
            ? [
              { header: "Name", accessor: (item: any) => item.name },
              {
                header: "Action", accessor: (item: any) => (
                  <>
                    <button className="text-blue-500  px-4 py-2 rounded" onClick={() => handleAction("edit", item._id)}
                      title="Update category">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button className="text-red-500  px-4 py-2 rounded" onClick={() => handleAction("delete", item._id)}
                      title="Delete category">
                      <Trash className="w-5 h-5" />
                    </button>
                  </>
                ),
              },
            ]
            : [
              { header: "Name", accessor: (item: any) => item.username },
              { header: "Email", accessor: (item: any) => item.email },
              { header: "Status", accessor: (item: any) => (item.isBlocked ? "Blocked" : "Active") },
              {
                header: "Action", accessor: (item: any) => (
                  <button
                    className={`px-4 py-2 rounded ${item.isBlocked ? "bg-blue-500" : "bg-red-500"} text-white`}
                    onClick={() => handleBlock(item.isBlocked ? "unblock" : "block",type, item.email)}
                  >
                    {item.isBlocked ? "Unblock" : "Block"}
                  </button>
                ),
              },
            ]
        }
      />
      <div className="flex justify-end mt-4">
        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPages} />
      </div>
      {modalOpen && (
            <CategoryModal
            isOpen={modalOpen}
            closeModal={() => setModalOpen(false)}
            category={selectedCategory}
            onCategoryUpdate={handleCategoryUpdate}
            onCategoryAdd={handleCategoryAdd}
            />
        )}
    </div>
    
  );
};

export default DataTable;
