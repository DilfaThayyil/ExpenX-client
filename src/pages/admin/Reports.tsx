import Layout from "@/layout/Sidebar";
import ReportTable from "@/components/admin/ReportTable";


const Reports = () => {
    return (
        <Layout role="admin">
            <div>
                <ReportTable />
            </div>
        </Layout>
    );
}

export default Reports