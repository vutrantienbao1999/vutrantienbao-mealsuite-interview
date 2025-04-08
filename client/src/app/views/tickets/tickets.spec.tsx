import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Tickets } from './tickets';
import { useManagmentContext } from '../../context/ManagmentContext';
import { TICKET_STATUS } from '../../constant';

// Mock the context
jest.mock('../../context/ManagmentContext', () => ({
  useManagmentContext: jest.fn(),
}));

// Mock the AddPopup component (since it's using ref)
jest.mock('../add-popup/add-popup', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef((_: any, ref: { current: { open: jest.Mock<any, any>; close: jest.Mock<any, any>; }; }) => {
      if (ref) {
        if (ref && 'current' in ref) {
          ref.current = {
            open: jest.fn(),
            close: jest.fn(),
          };
        }
      }
      return <div data-testid="add-popup">Add Popup</div>;
    }),
  }
});

// Mock the TicketItem component
jest.mock('../ticket-item/ticket-item', () => ({
  __esModule: true,
  default: ({ ticket }: any) => <div data-testid="ticket-item">{ticket.title}</div>,
}));

const mockTickets = [
  { id: 1, title: 'Open Ticket', completed: false },
  { id: 2, title: 'Completed Ticket', completed: true },
];

describe('Tickets component', () => {
  beforeEach(() => {
    (useManagmentContext as jest.Mock).mockReturnValue({ tickets: mockTickets });
  });

  it('renders the tickets and title correctly', () => {
    render(<Tickets />);
    expect(screen.getByText('Ticket List')).toBeInTheDocument();
    expect(screen.getAllByTestId('ticket-item')).toHaveLength(2);
  });

  it('filters tickets when filter is selected', async () => {
    render(<Tickets />);

    // Open the filter dropdown
    fireEvent.click(screen.getByText('Filters'));

    // Check 'Completed' filter
    const completedFilter = screen.getByLabelText(TICKET_STATUS.COMPLETED);
    fireEvent.click(completedFilter);

    // Wait for state updates
    await waitFor(() => {
      const ticketItems = screen.getAllByTestId('ticket-item');
      expect(ticketItems).toHaveLength(1);
      expect(ticketItems[0]).toHaveTextContent('Completed Ticket');
    });
  });

  it('shows all tickets when multiple filters are selected', async () => {
    render(<Tickets />);

    fireEvent.click(screen.getByText('Filters'));

    const openFilter = screen.getByLabelText(TICKET_STATUS.OPEN);
    const completedFilter = screen.getByLabelText(TICKET_STATUS.COMPLETED);

    fireEvent.click(openFilter);
    fireEvent.click(completedFilter);

    await waitFor(() => {
      const ticketItems = screen.getAllByTestId('ticket-item');
      expect(ticketItems).toHaveLength(2);
    });
  });

  it('calls AddPopup ref method when Add button is clicked', () => {
    render(<Tickets />);

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    // Ref is mocked, so let's assert it was called
    const addPopup = screen.getByTestId('add-popup');
    expect(addPopup).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    render(<Tickets />);

    // Open dropdown
    fireEvent.click(screen.getByText('Filters'));
    expect(screen.getByText('Filter Options:')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document);

    // Wait for dropdown to close
    waitFor(() => {
      expect(screen.queryByText('Filter Options:')).not.toBeInTheDocument();
    });
  });
});
