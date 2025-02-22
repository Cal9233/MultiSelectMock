import React, {createContext, useState, useContext, useMemo, useCallback} from 'react';

export const MultiSelectContext = createContext();

export const MultiSelectProvider = ({children, initialState, maxItems}) => {
    const [data] = useState(initialState);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [disabled, setDisabled] = useState(false);

    const filteredList = useMemo(() => data.filter(country => 
        country.label.toLowerCase().includes(searchValue.toLowerCase())
    ), [searchValue, data])

    const handleOnChange = useCallback((value) => {
        setSearchValue(value);
    }, [])

    const handleOnSelect = useCallback((item) => {
        setSelectedItems(prev => 
            prev.includes(item) ?
                prev.filter(x => x !== item)
                : [...prev, item]
        )
    }, []);

    const handleDropdownOpen = useCallback(() => {
        setIsDropdownOpen(true);
    }, [])

    const handleDropdownClose = useCallback(() => {
        setIsDropdownOpen(false);
    }, [])

    const handleRemoveItem = useCallback((item) => {
        handleOnSelect(item)
    }, [handleOnSelect])

    const handleOnClear = useCallback(() => {
        setSelectedItems([]);
        setSearchValue('');
    }, [])

    const value = useMemo(() => ({
        data,
        selectedItems,
        isDropdownOpen,
        searchValue,
        handleOnChange,
        filteredList,
        handleOnSelect,
        handleDropdownOpen,
        handleOnClear,
        handleRemoveItem,
        handleDropdownClose,
        disabled,
        setDisabled
    }), [
        data,
        selectedItems,
        isDropdownOpen,
        searchValue,
        handleOnChange,
        filteredList,
        handleOnSelect,
        handleDropdownOpen,
        handleOnClear,
        handleRemoveItem,
        handleDropdownClose,
        disabled
    ]);

    return (
        <MultiSelectContext.Provider value={value}>
            {children}
        </MultiSelectContext.Provider>
    )
}


export const useMultiSelect = () => {
    const context = useContext(MultiSelectContext);
    if(!context) throw new Error("useMultiSelect must be used within a MultiSelectProvider");
    return context;
}