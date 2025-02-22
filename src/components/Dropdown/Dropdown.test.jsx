// Dropdown.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MultiSelectProvider } from '../../context/MultiSelectContext';
import Dropdown, { DropdownButton, DropdownItem } from './Dropdown';

// Mock context values
const mockContextValue = {
    handleDropdownOpen: jest.fn(),
    filteredList: [
        { id: 1, label: 'USA' },
        { id: 2, label: 'Canada' },
        { id: 3, label: 'Mexico' }
    ],
    handleOnSelect: jest.fn(),
    selectedItems: []
};

// Wrapper component with context
const wrapper = ({ children }) => (
    <MultiSelectProvider value={mockContextValue}>
        {children}
    </MultiSelectProvider>
);

// Test DropdownButton component
describe('DropdownButton', () => {
    test('renders button with correct aria-label', () => {
        render(<DropdownButton />, { wrapper });
        const button = screen.getByLabelText('dropdown-btn');
        expect(button).toBeInTheDocument();
    });

    test('calls handleDropdownOpen when clicked', () => {
        render(<DropdownButton />, { wrapper });
        const button = screen.getByLabelText('dropdown-btn');
        fireEvent.click(button);
        expect(mockContextValue.handleDropdownOpen).toHaveBeenCalledTimes(1);
    });

    test('renders triangle icon', () => {
        render(<DropdownButton />, { wrapper });
        const triangle = screen.getByLabelText('triangle');
        expect(triangle).toBeInTheDocument();
    });
    });

    // Test DropdownItem component
    describe('DropdownItem', () => {
    const mockItem = { id: 1, label: 'Test Item' };
    const mockOnSelect = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders item with correct text', () => {
        render(
        <DropdownItem
            item={mockItem}
            onSelect={mockOnSelect}
            selectedItems={[]}
            isActive={false}
            disabled={false}
        >
            {mockItem.label}
        </DropdownItem>
        );
        expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    test('applies selected class when item is selected', () => {
        render(
        <DropdownItem
            item={mockItem}
            onSelect={mockOnSelect}
            selectedItems={[mockItem]}
            isActive={false}
            disabled={false}
        >
            {mockItem.label}
        </DropdownItem>
        );
        const item = screen.getByLabelText('dropdown-item');
        expect(item).toHaveClass('selected');
    });

    test('applies active class when isActive is true', () => {
        render(
        <DropdownItem
            item={mockItem}
            onSelect={mockOnSelect}
            selectedItems={[]}
            isActive={true}
            disabled={false}
        >
            {mockItem.label}
        </DropdownItem>
        );
        const item = screen.getByLabelText('dropdown-item');
        expect(item).toHaveClass('active');
    });

    test('calls onSelect when clicked and not disabled', () => {
        render(
        <DropdownItem
            item={mockItem}
            onSelect={mockOnSelect}
            selectedItems={[]}
            isActive={false}
            disabled={false}
        >
            {mockItem.label}
        </DropdownItem>
        );
        fireEvent.click(screen.getByText('Test Item'));
        expect(mockOnSelect).toHaveBeenCalledWith(mockItem);
    });

    test('shows alert when clicked while disabled', () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        render(
        <DropdownItem
            item={mockItem}
            onSelect={mockOnSelect}
            selectedItems={[]}
            isActive={false}
            disabled={true}
        >
            {mockItem.label}
        </DropdownItem>
        );
        fireEvent.click(screen.getByText('Test Item'));
        expect(alertMock).toHaveBeenCalledWith('You can only add up to 5 countries.');
        expect(mockOnSelect).not.toHaveBeenCalled();
        alertMock.mockRestore();
    });
    });

    // Test main Dropdown component
    describe('Dropdown', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders nothing when isOpen is false', () => {
        render(<Dropdown isOpen={false} activeIndex={-1} disabled={false} />, { wrapper });
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    test('renders list when isOpen is true', () => {
        render(<Dropdown isOpen={true} activeIndex={-1} disabled={false} ariaLabel="test-dropdown" />, { wrapper });
        const list = screen.getByLabelText('test-dropdown');
        expect(list).toBeInTheDocument();
    });

    test('renders all items from filteredList', () => {
        render(<Dropdown isOpen={true} activeIndex={-1} disabled={false} />, { wrapper });
        const items = screen.getAllByLabelText('dropdown-item');
        expect(items).toHaveLength(mockContextValue.filteredList.length);
    });

    test('renders "No results found" when filteredList is empty', () => {
        const emptyListContext = {
        ...mockContextValue,
        filteredList: []
        };
        render(
        <MultiSelectProvider value={emptyListContext}>
            <Dropdown isOpen={true} activeIndex={-1} disabled={false} />
        </MultiSelectProvider>
        );
        expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    test('passes correct props to DropdownItem', () => {
        const activeIndex = 1;
        render(
        <Dropdown isOpen={true} activeIndex={activeIndex} disabled={true} />,
        { wrapper }
        );
        
        const items = screen.getAllByLabelText('dropdown-item');
        expect(items[activeIndex]).toHaveClass('active');
        
        // Click an item and verify handleOnSelect is called
        fireEvent.click(items[0]);
        expect(mockContextValue.handleOnSelect).toHaveBeenCalledWith(mockContextValue.filteredList[0]);
    });
    });

    // Test memoization
    describe('DropdownItem memoization', () => {
    const mockItem = { id: 1, label: 'Test' };
    const mockOnSelect = jest.fn();
    let rerender;

    const view = render(
        <DropdownItem
            item={mockItem}
            onSelect={mockOnSelect}
            selectedItems={[]}
            isActive={false}
            disabled={false}
        >
            {mockItem.label}
        </DropdownItem>
    );
    rerender = view.rerender;

    test('component does not re-render when props remain the same', () => {
        const renderCount = jest.spyOn(console, 'log');
        
        // Re-render with same props
        rerender(
        <DropdownItem
            item={mockItem}
            onSelect={mockOnSelect}
            selectedItems={[]}
            isActive={false}
            disabled={false}
        >
            {mockItem.label}
        </DropdownItem>
        );

        expect(renderCount).not.toHaveBeenCalled();
        renderCount.mockRestore();
    });
});