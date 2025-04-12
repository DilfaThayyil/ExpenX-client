import { useEffect, useState } from 'react';
import { EmptyComponent } from '@/components/empty/Empty';
import Pagination from '@/components/admin/Pagination';
import Table from '@/components/admin/Table';
import { manageUser, fetchReports } from '@/services/admin/adminServices';
import useShowToast from '@/customHook/showToaster';
import {Report} from './types'


const ReportTable = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 5;
  const Toast=useShowToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchReports(currentPage, limit);
        if (response) {
          setReports(response.data.reports.reports);
          setTotalPages(Math.ceil(response.data.reports.totalReports/limit));
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchData();
  }, [currentPage]);
  const columns = [
    {
      header: 'Date',
      accessor: (item: Report) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      header: 'Advisor Name',
      accessor: (item: Report) => item.advisorId.username,
    },
    {
      header: 'User Name',
      accessor: (item: Report) => item.userId.username
    },
    {
      header: 'Reason',
      accessor: (item: Report) => item.reason,
    },
    {
      header: 'Custom Reason',
      accessor: (item: Report) =>  item.customReason ? item.customReason : 'N/A',
    },
   
    {
      header: "Action",
      accessor: (report: Report) =>
        report.advisorId.isBlocked? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleUser("unblock",'advisor',report.advisorId.email)}
          >
            Unblock
          </button>
        ) : (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleUser("block",'advisor',report.advisorId.email)}
          >
            Block
          </button>
        ),
    },
  ];
  
  const handleUser = async (action: string,type:'advisor'| 'user',email: string) => {
    try {
      const response = await manageUser(action,type,email);
      if (response.message) {
        Toast(`User ${action}ed successfully`, "success", true);
  
        setReports(
          reports.map((report) =>
            report.advisorId.email === email
              ? {
                  ...report,
                  advisorId: {
                    ...report.advisorId,
                    isBlocked: action === "block", 
                  },
                }
              : report
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <div className="p-8 container mx-auto px-20 mt-7">
      <h1 className="text-2xl font-semibold mb-4">Reports</h1>
      {reports.length > 0 ? (
        <>
          <Table data={reports} columns={columns} />
          <div className="flex justify-end mt-4">
            <Pagination
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </>
      ) : (
        <div className="flex justify-center mt-7">
          <EmptyComponent />
        </div>
      )}
    </div>
  );
};

export default ReportTable;
