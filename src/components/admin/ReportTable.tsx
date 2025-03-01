import { useEffect, useState } from 'react';
import { Empty } from "antd";
import Pagination from '@/components/admin/Pagination';
import Table from '@/components/admin/Table';
import { manageUser, fetchReports } from '@/services/admin/adminServices';
import useShowToast from '@/customHook/showToaster';

interface User {
  _id: string;
  email: string;
  firstName: string;
  secondName: string;
  isBlock:boolean
}

interface Report {
  _id: string;
  userId: User;
  advisorId: User;
  reason: string;
  createdAt: string;
}



const ReportTable = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 7;
  const Toast=useShowToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchReports(currentPage, limit);
        console.log("response : ",response)
        if (response) {
          setReports(response.data.reports);
          setTotalPages(response.data.totalReports);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchData();
  }, [currentPage]);

  const columns = [
    {
      header: 'Reported User',
      accessor: (item: Report) => item.user,
    },
    {
      header: 'Reported User Email',
      accessor: (item: Report) => item.reportedUserId.email,
    },
    {
      header: 'Reporter',
      accessor: (item: Report) => item.reporterUserId.firstName + ' ' + item.reporterUserId.secondName,
    },
    {
      header: 'Reporter Email',
      accessor: (item: Report) => item.reporterUserId.email,
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
      header: 'Date',
      accessor: (item: Report) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      header: "Action",
      accessor: (user: Report) =>
        user.reportedUserId.isBlock? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            // onClick={() => handleUser("unblock", user.reportedUserId.email)}
          >
            Unblock
          </button>
        ) : (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            // onClick={() => handleUser("block", user.reportedUserId.email)}
          >
            Block
          </button>
        ),
    },
  ];
  
//   const handleUser = async (action: string, email: string) => {
//     try {
//       const response = await manageUser(action, email);
//       if (response.message) {
//         Toast(`User ${action}ed successfully`, "success", true);
  
//         setReports(
//           users.map((user) =>
//             user.reportedUserId.email === email
//               ? {
//                   ...user,
//                   reportedUserId: {
//                     ...user.reportedUserId,
//                     isBlock: action === "block", 
//                   },
//                 }
//               : user
//           )
//         );
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };
  

  return (
    <div className="container mx-auto px-20 mt-7">
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
          <Empty />
        </div>
      )}
    </div>
  );
};

export default ReportTable;
