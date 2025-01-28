import Layout from "@/layout/Sidebar";
import Profile from '@/components/admin/ProfileComponent'

const AdminProfile=()=>{
  return (
    <Layout role="admin">
      <div>
        <Profile/>
      </div>
    </Layout>
  );
}

export default AdminProfile