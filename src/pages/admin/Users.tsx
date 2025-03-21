import Layout from "@/layout/Sidebar";
import DataTable from "@/components/admin/DataTable";
import { fetchUsers, manageUser } from "@/services/admin/adminServices";
import useShowToast from "@/customHook/showToaster";
import {AdminNavbar} from '@/layout/AdminNav'

const Users = () => {
  const Toast = useShowToast();

  // Define the columns for the user listing
  const columns = [
    { header: "Name", accessor: (item: any) => item.username },
    { header: "Email", accessor: (item: any) => item.email },
    {
      header: "Join Date",
      accessor: (item: any) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      header: "Status",
      accessor: (item: any) => (item.isBlocked ? "Blocked" : "Active"),
    },
  ];

  // Define actions for blocking/unblocking users
  const actions = (item: any) => (
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
    )
  );

  // Function to handle blocking/unblocking users
  const handleUser = async (action: string, email: string) => {
    try {
      const response = await manageUser(action, "user", email);
      if (response.message) {
        Toast(`User ${action}ed successfully`, "success", true);
      }
    } catch (err) {
      console.log(err);
      Toast(`Failed to ${action} the user`, "error", true);
    }
  };

  return (
    <Layout role="admin">
      <AdminNavbar />
      <DataTable
        type="user"
        fetchFunction={fetchUsers}
        manageFunction={handleUser}
        columns={columns}
        actions={actions}
      />
    </Layout>
  );
};

export default Users;
