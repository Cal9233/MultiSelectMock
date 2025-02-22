import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiSelectProvider } from '../../context/MultiSelectContext';
import MultiSelect from './MultiSelect';

const mockCountries = [
    { label: 'United States', value: 'usa', id: '1' },
    { label: 'Canada', value: 'can', id: '2' },
    { label: 'Mexico', value: 'mex', id: '3' }
];

const mockMaxItems = 3;

const renderMultiSelect = () => {
    return render(
        <MultiSelectProvider initialState={mockCountries} maxItems={mockMaxItems}>
            <MultiSelect />
        </MultiSelectProvider>
    )
}

describe("Multiselect Component", () => {
    // Basic Rendering test
    test('renders Multiselect component', () => {
        renderMultiSelect();
        expect(screen.getByPlaceHolderTest("Search...")).toBeInTheDocument();
    });

    // Search functionality test
    test("filters options when searching", async () => {
        renderMultiSelect();
        const searchInput = screen.getByPlaceHolderTest("Search...");
        await userEvent.type(searchInput, "United");

        //Check if filtered results show up
        expect(screen.getByText("United States")).toBeInTheDocument();
        expect(screen.queryByText("Canada")).toBeInTheDocument();
    })

    // Selection test

    
})