import React, { useState, useEffect } from "react";
import BookedAppointmentsTable from "@/components/advisor/appointments/bookedSlots";
import { getBookedSlotsForAdvisor } from "@/services/advisor/advisorService";
import { Calendar, MessageCircle, X, Search, Filter } from "lucide-react";
import Layout from "@/layout/Sidebar";
import Store from "@/store/store";
import Pagination from "@/components/admin/Pagination";
import ChatWindow from "@/components/chat/chat";

export interface Booking {
  date: string;
  endTime: string;
  startTime: string;
  bookedBy: {
    _id: string;
    username: string;
    email: string;
    profilePic: string;
  };
  _id: string;
  userName: string;
  userEmail: string;
  slotId: string;
  bookedDate: string;
  paymentStatus: "Paid" | "Pending";
  location: "Virtual" | "Physical";
  status: "Available" | "Booked" | "Cancelled";
  locationDetails: string;
  description: string;
}

const Clients: React.FC = () => {
  const [bookedAppointments, setBookedAppointments] = useState<Booking[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Booking[]>([]);
  const [clientList, setClientsList] = useState<{
    _id: string;
    username: string;
    email: string;
    profilePic: string;
  }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterPayment, setFilterPayment] = useState<string>("All");
  const [filterLocation, setFilterLocation] = useState<string>("All");
  const [showChat, setShowChat] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const advisor = Store((state) => state.user);
  const advisorId = advisor?._id;
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    if (!advisorId) return;

    const fetchBookedSlots = async () => {
      try {
        const response = await getBookedSlotsForAdvisor(advisorId, currentPage, ITEMS_PER_PAGE);

        const { bookedSlots, totalPages } = response.data;
        setBookedAppointments(Array.isArray(bookedSlots) ? bookedSlots : bookedSlots ? [bookedSlots] : []);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
        setBookedAppointments([]);
      }
    };

    fetchBookedSlots();
  }, [advisorId, currentPage]);

  useEffect(() => {
    let filtered = bookedAppointments;

    if (searchQuery) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.bookedBy.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.bookedBy.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterStatus !== "All") {
      filtered = filtered.filter((appointment) => appointment.status === filterStatus);
    }
    if (filterPayment !== "All") {
      filtered = filtered.filter((appointment) => appointment.paymentStatus === filterPayment);
    }
    if (filterLocation !== "All") {
      filtered = filtered.filter((appointment) => appointment.location === filterLocation);
    }
    setFilteredAppointments(filtered);
  }, [bookedAppointments, searchQuery, filterStatus, filterPayment, filterLocation]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
    setFilterPayment('All');
    setFilterLocation('All');
  };

  const handleShowChat = () => {
    const uniqueClients = new Map();

    bookedAppointments.forEach((appointment) => {
      if (!uniqueClients.has(appointment.bookedBy._id)) {
        uniqueClients.set(appointment.bookedBy._id, appointment.bookedBy);
      }
    });

    const clientsArray = Array.from(uniqueClients.values());

    setClientsList(clientsArray);
    setShowChat(true)
  }

  return (
    <Layout role="advisor">
      {/* If showChat is true, show full-screen chat */}
      {showChat ? (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => setShowChat(false)}
            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X size={20} />
          </button>
          {/* Full-Screen Chat Window */}
          <ChatWindow receivers={clientList} />
        </div>
      ) : (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center justify-between">
            <span className="flex items-center">
              <Calendar className="mr-3 text-blue-600" /> Client Management
            </span>
            <div className="flex space-x-2">
              <button
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition flex items-center"
                title="Toggle Filters"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} />
              </button>
              <button
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition flex items-center"
                title="Start Messaging"
                onClick={handleShowChat}
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </h1>
          
          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="p-2 pl-10 border border-gray-300 rounded-lg w-full"
                placeholder="Search by client name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters Collapsible Panel */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 transition-all duration-300">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-gray-700">Advanced Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Status</label>
                  <select
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-50"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Payment Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-50"
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value)}
                  >
                    <option value="All">All Payments</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                  <select
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-50"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <option value="All">All Locations</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Physical">Physical</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results Count and Stats */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredAppointments.length} of {bookedAppointments.length} appointments
            </p>
            {(filterStatus !== "All" || filterPayment !== "All" || filterLocation !== "All" || searchQuery) && (
              <div className="text-sm text-blue-600">
                Filters active
              </div>
            )}
          </div>

          <div className="w-full bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <BookedAppointmentsTable appointments={filteredAppointments} />
          </div>

          {/* Empty State */}
          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 bg-white rounded-lg mt-4">
              <p className="text-gray-500">No appointments match your filters</p>
              <button 
                onClick={clearFilters}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination Component */}
          {filteredAppointments.length > 0 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </div>
      )}
    </Layout>
  );
};

export default Clients;