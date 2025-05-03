import { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface SlotFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterLocation: string;
  setFilterLocation: (location: string) => void;
  startDateFilter: string;
  setStartDateFilter: (date: string) => void;
  endDateFilter: string;
  setEndDateFilter: (date: string) => void;
  resetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

const SlotFilters: React.FC<SlotFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  setFilterStatus,
  filterLocation,
  setFilterLocation,
  startDateFilter,
  setStartDateFilter,
  endDateFilter,
  setEndDateFilter,
  resetFilters,
  filteredCount,
  totalCount
}) => {
  const [showFilters, setShowFilters] = useState(false);
  
  const hasActiveFilters = 
    searchQuery || 
    filterStatus !== "All" || 
    filterLocation !== "All" || 
    startDateFilter || 
    endDateFilter;

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by advisor name"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-2.5 text-gray-400"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
        >
          <Filter className="mr-2" size={18} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

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

      <div className="text-sm text-gray-600 mb-4">
        Showing {filteredCount} {filteredCount === 1 ? 'slot' : 'slots'}
        {hasActiveFilters && ' with applied filters'}
        {hasActiveFilters && filteredCount !== totalCount && ` (out of ${totalCount} total)`}
      </div>
    </div>
  );
};

export default SlotFilters;