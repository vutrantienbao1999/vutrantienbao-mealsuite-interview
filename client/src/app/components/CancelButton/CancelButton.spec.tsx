import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CancelButton from './CancelButton';

describe('CancelButton Component', () => {
  it('renders the button with the correct text', () => {
    render(<CancelButton handleOnClick={jest.fn()} />);

    // Check that the button is in the document
    const button = screen.getByRole('button', { name: /Cancel/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Cancel');
  });

  it('calls handleOnClick when the button is clicked', () => {
    const mockHandleOnClick = jest.fn(); // Mock the click handler
    render(<CancelButton handleOnClick={mockHandleOnClick} />);

    // Simulate the button click
    const button = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(button);

    // Assert that the mock function was called once
    expect(mockHandleOnClick).toHaveBeenCalledTimes(1);
  });
});
