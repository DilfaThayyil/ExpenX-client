interface Booking {
    id: string;
    userName: string;
    userEmail: string;
    slotId: string;
    paymentStatus: 'Paid' | 'Pending';
  }


const BookedAppointmentsTable: React.FC<{ appointments: Booking[] }> = ({ appointments }) => {
    return (
        <table className="w-full">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Payment Status</th>
                    <th className="p-4 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                {appointments.map(appointment => (
                    <tr key={appointment.id} className="border-b">
                        <td className="p-4">{appointment.userName}</td>
                        <td className="p-4">{appointment.userEmail}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded ${appointment.paymentStatus === 'Paid'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {appointment.paymentStatus}
                            </span>
                        </td>
                        <td className="p-4">
                            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                Join Call
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BookedAppointmentsTable