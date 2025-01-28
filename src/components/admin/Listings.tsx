import { useEffect, useState } from "react";
import Table from "@/components/admin/Table";
import { fetchUsers, fetchAdvisors } from "@/services/admin/adminServices";
import useShowToast from "@/customHook/showToaster";
import Loading from "@/style/loading";
import Pagination from "@/components/admin/Pagination";

interface User {
  username: string;
  email: string;
  isBlock: boolean;
  createdAt: string;
  country: string;
}

interface UserTableProps {
  type: "user" | "advisor";
}

const UserTable: React.FC<UserTableProps> = ({ type }) => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(3);
  const limit = 4;
  const Toast = useShowToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response =
          type === "user"
            ? await fetchUsers(currentPage, limit)
            : await fetchAdvisors(currentPage, limit);
        setData(response.data.users || response.data.advisors);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch ${type}s`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, currentPage]);

  // Dynamic columns based on type
  const columns = [
    {
      header: "Name",
      accessor: (item: User) => item.username,
    },
    { header: "Email", accessor: (item: User) => item.email },
    {
      header: "Join Date",
      accessor: (item: User) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      header: "Status",
      accessor: (item: User) => (item.isBlock ? "Blocked" : "Active"),
    },
    {
      header: "Action",
      accessor: (item: User) =>
        item.isBlock ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleUser("unblock", item.email)}
          >
            Unblock
          </button>
        ) : (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleUser("block", item.email)}
          >
            Block
          </button>
        ),
    },
  ];

  // Handle block/unblock actions
  const handleUser = async (action: string, email: string) => {
    try {
      // const response = await manageUser(action, email);
      if (response.message) {
        Toast(`${type} ${action}ed successfully`, "success", true);
        setData(
          data.map((item) =>
            item.email === email
              ? { ...item, isBlock: action === "block" }
              : item
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

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
        placeholder={`Search ${type}s`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Table<User>
        data={data.filter((item) =>
          item.email.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        columns={columns}
      />
      <div className="flex justify-end mt-4">
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default UserTable;
