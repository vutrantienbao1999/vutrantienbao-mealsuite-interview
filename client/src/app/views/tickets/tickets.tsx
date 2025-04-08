import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { Ticket } from '@acme/shared-models';

import TicketItem from '../ticket-item/ticket-item';
import { useManagmentContext } from '../../context/ManagmentContext';
import AddPopup from '../add-popup/add-popup';
import { TICKET_STATUS } from '../../constant';

interface FilterOption {
  id: number
  checked: boolean;
  label: string;
}

const filterOptions: FilterOption[] = [
  { id: 0, checked: false, label: TICKET_STATUS.OPEN },
  { id: 1, checked: false, label: TICKET_STATUS.COMPLETED },
];

export function Tickets() {
  const { tickets } = useManagmentContext();

  const [ticketOnScreen, setTicketOnScreen] = useState<Ticket[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>(filterOptions);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<{ open: () => void; close: () => void }>(null);

  // Update the selected filters
  const handleFilterToggle = (index: number) => {
    setSelectedFilters((prev) =>
      prev.map((checkbox, i) =>
        i === index
          ? { ...checkbox, checked: !checkbox.checked } // Toggle the checked state
          : checkbox
      )
    );
  };

  // Update the ticketOnScreen based on selected filters
  const handleUpdateTicketOnScreen = useCallback(() => {
    const checkedFilter = selectedFilters.filter((option) => option.checked);
    if (checkedFilter.length === 1) {
      setTicketOnScreen(prev => prev.filter(ticket => checkedFilter[0].label === TICKET_STATUS.COMPLETED ? ticket.completed : !ticket.completed));
      return;
    }

    setTicketOnScreen(tickets);
  }, [selectedFilters, tickets]);

  //Toggle dropdown section
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: { target: any; }) => {
    console.log(dropdownRef.current);
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false); // Close the toggle if click is outside
    }
  };

  useEffect(() => {
    handleUpdateTicketOnScreen()
  }, [handleUpdateTicketOnScreen]);

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className='ticket-list'>
        <h1 className='text-center text-black text-3xl'>Ticket List</h1>
        <div className="flex my-8 gap-4">
          <button className="bg-cyan-500 text-white py-2 px-4 rounded-md" onClick={popupRef.current?.open}>
            Add
          </button>
          <div className="relative" ref={dropdownRef}>
            {/* Filter Button */}
            <button
              onClick={toggleDropdown}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
            >
              Filters
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-72 z-50">
                <div className="p-4">
                  {/* Filter Options */}
                  <p className="text-gray-800 font-medium mb-3">Filter Options:</p>

                  {selectedFilters.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`filter-${index}`}
                        className="form-checkbox text-blue-500 focus:ring-2 focus:ring-blue-500"
                        checked={option.checked}
                        onChange={() => handleFilterToggle(index)}
                      />
                      <label htmlFor={`filter-${index}`} className="ml-2 text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}

                </div>
              </div>
            )}
          </div>
        </div>
        <div className='ticket-container grid grid-cols-4 gap-4'>
          {ticketOnScreen.map((ticket: Ticket) => (
            <TicketItem key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
      <AddPopup ref={popupRef} />
    </>

  );
}

export default Tickets;
