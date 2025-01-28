import Layout from "@/layout/Sidebar";
import UserTable from '@/components/admin/Listings'

const Users = ()=>{
  return (
    <Layout role="admin">
      <>
      <UserTable type="user"/>
      </>
    </Layout>
  );
}

export default Users