import Layout from "@/layout/Sidebar";
import DataTable from "@/components/admin/DataTable";
import { fetchAdvisors, manageUser } from "@/services/admin/adminServices";
import useShowToast from "@/customHook/showToaster";
import {AdminNavbar} from '@/layout/AdminNav'

const Advisors = () => {
  const Toast = useShowToast();

  const columns = [
    { header: "Name", accessor: (item: any) => item.username },
    { header: "Email", accessor: (item: any) => item.email },
    {
      header: "Join Date",
      accessor: (item: any) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      header: "Status",
      accessor: (item: any) => (item.isBlock ? "Blocked" : "Active"),
    },
  ];

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

  const handleUser = async (action: string, email: string) => {
    try {
      const response = await manageUser(action, "advisor", email);
      if (response.message) {
        Toast(`Advisor ${action}ed successfully`, "success", true);
      }
    } catch (err) {
      Toast(`Failed to ${action} the advisor`, "error", true);
    }
  };

  return (
    <Layout role="admin">
      <AdminNavbar />
      <DataTable
        type="advisor"
        fetchFunction={fetchAdvisors}
        manageFunction={handleUser}
        columns={columns}
        actions={actions}
      />
    </Layout>
  );
};

export default Advisors;
