import Layout from "@/layout/Sidebar";
import ReportTable from "@/components/admin/ReportTable";
import {AdminNavbar} from '@/layout/AdminNav'

const Reports = () => {
    return (
        <Layout role="admin">
            <AdminNavbar />
            <div>
                <ReportTable />
            </div>
        </Layout>
    );
}

export default Reports