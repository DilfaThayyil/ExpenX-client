import SlotCreationModal from '@/components/advisor/appointments/addSlotModal';
import SlotTable from '@/components/advisor/appointments/SlotTable';
import { createSlot, fetchSlots, updateSlot, deleteSlot } from '@/services/advisor/advisorService';
import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, Plus, Search, Filter, X } from 'lucide-react';
import Layout from '@/layout/Sidebar';
import Store from '@/store/store';
import Pagination from "@/components/admin/Pagination"; 
import useShowToast from '@/customHook/showToaster';
import {Slot} from './types'
import useDebounce from '@/hooks/use-debounce'


const SlotManage: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inputValue, setInputValue] = useState('');  
  const [debouncedQuery, setSearchQuery] = useDebounce('', 500);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterLocation, setFilterLocation] = useState<string>("All");
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const ITEMS_PER_PAGE = 5;
  const advisor = Store(state => state.user);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const Toaster = useShowToast();

  const fetchSlot = async () => {
    try {
      const response = await fetchSlots(advisor._id, currentPage, ITEMS_PER_PAGE,debouncedQuery);
      console.log("res-fetchSlots : ",response)
      const { slots, totalPages } = response.data;
      setSlots(slots);
      setFilteredSlots(slots);
      setTotalPages(totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSlot();
  }, [currentPage,debouncedQuery]);

  const applyFilters = useCallback(() => {
    let filtered = [...slots];

    if (filterStatus !== "All") {
      filtered = filtered.filter(slot => slot.status === filterStatus);
    }

    if (filterLocation !== "All") {
      filtered = filtered.filter(slot => slot.location === filterLocation);
    }

    if (startDateFilter) {
      filtered = filtered.filter(slot => new Date(slot.date) >= new Date(startDateFilter));
    }

    if (endDateFilter) {
      filtered = filtered.filter(slot => new Date(slot.date) <= new Date(endDateFilter));
    }

    setFilteredSlots(filtered);
  }, [slots, inputValue, filterStatus, filterLocation, startDateFilter, endDateFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setFilterStatus("All");
    setFilterLocation("All");
    setStartDateFilter('');
    setEndDateFilter('');
    setFilteredSlots(slots);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSearchQuery(e.target.value); 
  };

  const createNewSlot = async (newSlot: Slot) => {
    try {
      const id = advisor._id;
      const response = await createSlot(id, newSlot);
      Toaster('Slot created successfully', 'success');
      setSlots([...slots, response.Slot]);
      setFilteredSlots([...filteredSlots, response.Slot]);
      setIsCreateModalOpen(false);
    } catch (err:any) {
      console.error(err);
      Toaster(err.response.data.message, 'error');
    }
  };

  const handleUpdateSlot = async (updatedSlot: Slot) => {
    try {
      const response = await updateSlot(updatedSlot, updatedSlot._id);
      const updatedSlots = slots.map(slot => (slot._id === updatedSlot._id ? response.slot : slot));
      setSlots(updatedSlots);
      setFilteredSlots(updatedSlots);
      Toaster(response.message, 'success');
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(err);
      Toaster('Failed to update slot', 'error');
    }
  };

  const handleDeleteSlot = async(slotId: string) => {
    try {
      await deleteSlot(slotId);
      const updatedSlots = slots.filter(slot => slot._id !== slotId);
      setSlots(updatedSlots);
      setFilteredSlots(updatedSlots);
      Toaster('Slot deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      Toaster('Failed to delete slot', 'error');
    }
  };

  return (
    <Layout role='advisor'>
      <div className="container mx-auto p-4 min-h-screen">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
            <Calendar className="mr-3 text-blue-600" /> Slot Management
          </h1>
          
          {/* Search and Filter UI */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by description..."
                value={inputValue}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              <Filter className="mr-2" size={18} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Locations</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Physical">Physical</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-2">
                <button
                  onClick={resetFilters}
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  <X className="mr-2" size={16} />
                  Reset Filters
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center mb-6"
          >
            <Plus className="mr-2" /> Create New Slot
          </button>

          {/* Slot Creation Modal */}
          {isCreateModalOpen && (
            <SlotCreationModal
              onClose={() => {
                setIsCreateModalOpen(false);
                setSelectedSlot(null);
              }}
              onCreate={createNewSlot}
              onUpdate={handleUpdateSlot}
              existingSlot={selectedSlot}
            />
          )}

          {/* Results Summary */}
          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredSlots.length} {filteredSlots.length === 1 ? 'slot' : 'slots'}
            {(inputValue || filterStatus !== "All" || filterLocation !== "All" || startDateFilter || endDateFilter) && 
              ' with applied filters'}
          </div>

          {/* Slots Table */}
          <div className="bg-white shadow-md rounded-lg">
            <SlotTable
              slots={filteredSlots}
              onEdit={(slot) => {
                setSelectedSlot(slot);
                setIsCreateModalOpen(true);
              }}              
              onDelete={handleDeleteSlot}
            />
          </div>

          {/* Show pagination when not filtered */}
          {(inputValue === '' && filterStatus === "All" && filterLocation === "All" && !startDateFilter && !endDateFilter) && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SlotManage;