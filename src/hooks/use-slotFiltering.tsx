import { useState, useEffect, useCallback } from 'react';
import { fetchSlotsByUser } from '@/services/user/userService';
import { Slot } from '@/pages/user/types';
import useDebounce from '@/hooks/use-debounce';

interface UseSlotFilteringProps {
  userId: string;
  itemsPerPage: number;
}

export const useSlotFiltering = ({ userId, itemsPerPage }: UseSlotFilteringProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useDebounce('', 500);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterLocation, setFilterLocation] = useState<string>("All");
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');
  
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchSlotsByUser(
        userId, 
        currentPage, 
        itemsPerPage,
        debouncedQuery,
        filterStatus,
        filterLocation,
        startDateFilter,
        endDateFilter
      );
      
      setSlots(response.data.slots);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch slots');
    } finally {
      setIsLoading(false);
    }
  }, [
    userId, 
    currentPage, 
    itemsPerPage, 
    debouncedQuery, 
    filterStatus, 
    filterLocation, 
    startDateFilter, 
    endDateFilter
  ]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setDebouncedQuery(value);
  };
  
  const resetFilters = () => {
    setFilterStatus("All");
    setFilterLocation("All");
    setStartDateFilter('');
    setEndDateFilter('');
    setSearchQuery('');
    setDebouncedQuery('');
    setCurrentPage(1); 
  };

  const updateSlotStatus = (slotId: string, newStatus: Slot["status"]) => {
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot._id === slotId
          ? { ...slot, status: newStatus }
          : slot
      )
    );
  };
  

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  return {
    slots,
    isLoading,
    error,
    currentPage,
    totalPages,
    searchQuery,
    filterStatus,
    filterLocation,
    startDateFilter,
    endDateFilter,
    
    setCurrentPage,
    handleSearchChange,
    setFilterStatus,
    setFilterLocation,
    setStartDateFilter,
    setEndDateFilter,
    resetFilters,
    updateSlotStatus
  };
};