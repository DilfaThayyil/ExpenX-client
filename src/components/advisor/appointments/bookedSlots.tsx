import { useNavigate } from "react-router-dom";
import { BookedAppointmentsTableProps, Booking } from './types'


const BookedAppointmentsTable: React.FC<BookedAppointmentsTableProps> = ({ appointments }) => {
    const navigate = useNavigate();
    const normalizedAppointments: Booking[] = Array.isArray(appointments) ? appointments : appointments ? [appointments] : [];
    return (
        <div className="w-full">
            <div className="w-full overflow-x-auto bg-white shadow-lg rounded-lg p-4">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-6 py-3 border-b">Profile</th>
                            <th className="px-6 py-3 border-b">Name</th>
                            <th className="px-6 py-3 border-b">Email</th>
                            <th className="px-6 py-3 border-b">Date</th>
                            <th className="px-6 py-3 border-b">Time</th>
                            <th className="px-6 py-3 border-b">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {normalizedAppointments.length > 0 && Array.isArray(normalizedAppointments) ? (
                            normalizedAppointments.map((appointment, index) => (
                                <tr key={appointment._id}
                                    className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition cursor-pointer`}
                                    onClick={() => navigate(`/advisor/clientProfile/${appointment.bookedBy._id}`)}
                                >
                                    <td className="px-6 py-3">
                                        <img
                                            src={appointment.bookedBy.profilePic}
                                            alt={`${appointment.bookedBy.username}'s profile`}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-3">{appointment.bookedBy.username}</td>
                                    <td className="px-6 py-3">{appointment.bookedBy.email}</td>
                                    <td className="px-6 py-3">{appointment.date}</td>
                                    <td className="px-6 py-3">{appointment.startTime}</td>
                                    <td className="px-6 py-3">{appointment.location}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-600">
                                    No booked appointments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookedAppointmentsTable;