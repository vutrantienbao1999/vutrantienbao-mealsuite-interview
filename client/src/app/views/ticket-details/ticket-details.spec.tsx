import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { useManagmentContext } from '../../context/ManagmentContext';
import TicketDetails from './ticket-details';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../../services/apiServices';
import { TICKET_STATUS } from '../../constant';

// Mock dependencies
jest.mock('../../context/ManagmentContext');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock('../../services/apiServices');

// Helpers
const mockNavigate = jest.fn();
const mockHandleFetchData = jest.fn();

describe('TicketDetails Component', () => {
  const mockTicket = [{
    id: 1,
    assigneeId: 2,
    completed: false,
    description: 'Test ticket description',
  }, {
    id: 4,
    assigneeId: 4,
    completed: true,
    description: 'Test ticket description 2',
  },];

  const mockUsers = [
    { id: 2, name: 'User 1' },
    { id: 3, name: 'User 2' },
  ];

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    (useManagmentContext as jest.Mock).mockReturnValue({
      tickets: mockTicket,
      users: mockUsers,
      handleFetchData: mockHandleFetchData,
    });
    jest.clearAllMocks();
  });

  it('renders ticket details correctly', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<TicketDetails />);

    expect(screen.getByText(/Ticket ID: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test ticket description/i)).toBeInTheDocument();
  });

  it('navigates back when clicking cancel', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<TicketDetails />);

    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('submits form and calls API for unassigning', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<TicketDetails />);

    const assigneeSelect = screen.getByRole('combobox', { name: /Assignee/i });

    fireEvent.change(assigneeSelect, { target: { value: '0' } }); // Unassigned

    const updateButton = screen.getByText(/Update/i);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith('/tickets/1/unassign', 'PUT');
      expect(mockHandleFetchData).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith
    });
  });

  it('submits form and calls API for assigning to another', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<TicketDetails />);

    const assigneeSelect = screen.getByRole('combobox', { name: /Assignee/i });

    fireEvent.change(assigneeSelect, { target: { value: 3 } }); // Assign to User 1

    const updateButton = screen.getByText(/Update/i);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith('/tickets/1/assign/3', 'PUT');
      expect(mockHandleFetchData).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('submits form and calls API for open ticket', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '4' });
    render(<TicketDetails />);

    const statusSelect = screen.getByRole('combobox', { name: /Status/i });
    fireEvent.change(statusSelect, { target: { value: TICKET_STATUS.OPEN } });

    const updateButton = screen.getByText(/Update/i);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith('/tickets/4/complete', 'DELETE');
      expect(mockHandleFetchData).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('submits form and calls API for completing ticket', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(<TicketDetails />);

    const statusSelect = screen.getByRole('combobox', { name: /Status/i });
    fireEvent.change(statusSelect, { target: { value: TICKET_STATUS.COMPLETED } });

    const updateButton = screen.getByText(/Update/i);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith('/tickets/1/complete', 'PUT');
      expect(mockHandleFetchData).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should not call apiRequest if no changes are made', async () => {
    render(<TicketDetails />);

    const updateButton = screen.getByText(/Update/i);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(apiRequest).not.toHaveBeenCalled();
      expect(mockHandleFetchData).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
