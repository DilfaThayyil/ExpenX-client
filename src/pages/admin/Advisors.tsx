import Layout from "@/layout/Sidebar";
import UserTable from '@/components/admin/Listings'

 const Advisors=()=>{
  return (
    <Layout role="admin">
      <>
      <UserTable type="advisor"/>
      </>
    </Layout>
  );
}

export default Advisors
