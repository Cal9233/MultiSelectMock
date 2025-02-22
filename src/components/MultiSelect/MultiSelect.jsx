import React, {useState, useEffect, useRef} from 'react';
import {useMultiSelect} from '../../context/MultiSelectContext';
import './MultiSelect.css'
import Search from '../Search/Search';
import Dropdown from '../Dropdown/Dropdown';

const MultiSelect = ({maxItems}) => {
    const {
        disabled, 
        setDisabled, 
        isDropdownOpen, 
        handleOnSelect, 
        handleDropdownClose, 
        handleDropdownOpen, 
        filteredList,
        selectedItems
    } = useMultiSelect();
    const [activeIndex, setActiveIndex] = useState(-1);
    const dropRef = useRef(null);
    const inputRef = useRef(null);

    const handleClickOutside = (e) => {
        if (dropRef.current && !dropRef.current.contains(e.target)){
                handleDropdownClose();
        }
    };

    useEffect(() => {
        dropRef.current.focus()
    }, [])

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleKeyNavigation = (e) => {
        if (disabled) return;
        switch(e.key){
            case 'ArrowDown':
                e.preventDefault();
                if(!isDropdownOpen) handleDropdownOpen();
                setActiveIndex(prev => (prev < filteredList.length - 1) ? prev + 1 : 0);
                break;
            case 'ArrowUp': 
                e.preventDefault();
                if(!isDropdownOpen) handleDropdownOpen();
                setActiveIndex(prev => (prev > 0) ? prev - 1 : filteredList.length - 1)
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && filteredList[activeIndex]) handleOnSelect(filteredList[activeIndex]);
                break;
            case 'Escape':
                handleDropdownClose();
                setActiveIndex(-1);
                break;
            default:
                break
        }
    }

    useEffect(() => {
        if(selectedItems.length >= 5) setDisabled(true);
        else setDisabled(false);
    }, [selectedItems]);

    return (
        <div className="multiselect-container" ref={dropRef} activeindex="-1" onKeyDown={(e) => handleKeyNavigation(e)}>
            {/* Search */}
            <div className="search-container">
                <Search 
                    ref={inputRef} 
                    onKeyNavigation={handleKeyNavigation}
                    onFocus={handleDropdownOpen}
                    maxItems={maxItems}
                />
            </div>
            {/* Dropdown */}
            {isDropdownOpen && (<Dropdown activeIndex={activeIndex} isOpen={isDropdownOpen} disabled={disabled} />)}
        </div>
    )
}

export default MultiSelect