import { render, screen, fireEvent } from '@testing-library/react';
import ApproveButton from './ApproveButton';

describe('ApproveButton Component', () => {
  it('renders the button with the correct children', () => {
    render(<ApproveButton>Approve</ApproveButton>);

    // Check if the button is rendered
    const button = screen.getByRole('button', { name: /Approve/i });
    expect(button).toBeInTheDocument();

    // Verify the text inside the button
    expect(button).toHaveTextContent('Approve');
  });

  it('calls the onClick handler when the button is clicked', () => {
    const mockOnClick = jest.fn();
    render(<ApproveButton onClick={mockOnClick}>Click Me</ApproveButton>);

    // Simulate a button click
    const button = screen.getByRole('button', { name: /Click Me/i });
    fireEvent.click(button);

    // Assert that the mock function was called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('accepts additional props and applies them correctly', () => {
    render(<ApproveButton data-testid="approve-button">Submit</ApproveButton>);

    // Check for the custom attribute
    const button = screen.getByTestId('approve-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Submit');
  });

  it('renders with the correct classes for styling', () => {
    render(<ApproveButton>Styling Test</ApproveButton>);

    // Validate CSS classes
    const button = screen.getByRole('button', { name: /Styling Test/i });
    expect(button).toHaveClass('ml-3 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600');
  });
});
