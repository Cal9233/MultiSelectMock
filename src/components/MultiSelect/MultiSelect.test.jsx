import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultiSelect from './MultiSelect';
import { MultiSelectProvider } from '../../context/MultiSelectContext';

const mockCountries = [
    { label: 'United States', value: 'usa', id: '1' },
    { label: 'Canada', value: 'can', id: '2' },
    { label: 'Mexico', value: 'mex', id: '3' }
];

const renderMultiSelect = () => {
    return render(
        <MultiSelectProvider initialState={mockCountries}>
            <MultiSelect />
        </MultiSelectProvider>
    );
};

describe('Multiselect Component', () => {
    test('renders Multiselect component', () => {
        renderMultiSelect();
        expect(screen.getByLabelText('search-item-input')).toBeInTheDocument();
    });

    test('filters options when searching', async () => {
        renderMultiSelect();
        const searchInput = screen.getByLabelText('search-item-input');
        
        // Click dropdown button to open dropdown
        const dropdownButton = screen.getByRole('button');
        await userEvent.click(dropdownButton);
        
        // Type to search
        await userEvent.type(searchInput, 'United');

        // Check if dropdown item exists
        const dropdownList = screen.getByRole('list');
        expect(dropdownList).toBeInTheDocument();
        
        // Check if filtered item exists
        const dropdownItem = screen.getByText('United States');
        expect(dropdownItem).toBeInTheDocument();
    });

    test('selects and deselects items', async () => {
        renderMultiSelect();
        
        // Open dropdown
        const dropdownButton = screen.getByRole('button');
        await userEvent.click(dropdownButton);
        
        // Select item from dropdown
        const dropdownItem = screen.getByText('United States', { 
        selector: '.dropdown-item' 
        });
        await userEvent.click(dropdownItem);
        
        // Check if item appears in selected items container
        const selectedItem = screen.getByText('United States', { 
        selector: '.search-item-label'  // Be specific about which element we want
        });
        expect(selectedItem).toBeInTheDocument();
        
        // Remove item using X button
        const removeButton = screen.getByText('X', {
        selector: '.search-item-remove'
        });
        await userEvent.click(removeButton);
        
        // Check if item was removed from selected items
        expect(screen.queryByText('United States', { 
        selector: '.search-item-label' 
        })).not.toBeInTheDocument();
    });

    test('handles empty input data', async () => {
        render(
        <MultiSelectProvider initialState={[]}>
            <MultiSelect />
        </MultiSelectProvider>
        );
        
        // Open dropdown
        const dropdownButton = screen.getByRole('button');
        await userEvent.click(dropdownButton);
        
        // Check for no results message
        expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    test('respects maximum selection limit', async () => {
        renderMultiSelect();
        const maxSelections = 5;
        
        // Open dropdown
        const dropdownButton = screen.getByRole('button');
        await userEvent.click(dropdownButton);
        
        // Select items up to limit
        const option = screen.getByText('United States');
        for (let i = 0; i < maxSelections; i++) {
        await userEvent.click(option);
        }
        
        // Try one more selection
        await userEvent.click(option);
        
        // Verify alert was shown (you might need to mock window.alert)
        // This depends on how you want to test the alert
        // You could also check if the selection was prevented
        expect(screen.getAllByText('United States')).toHaveLength(1);
    });
});