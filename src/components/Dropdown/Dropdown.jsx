import React, {memo, useCallback} from 'react';
import './Dropdown.css';
import { useMultiSelect } from '../../context/MultiSelectContext';

export const DropdownButton = memo(() => {
  const {handleDropdownOpen} = useMultiSelect();
  return (
    <button aria-label="dropdown-btn" className="dropdown-btn" onClick={handleDropdownOpen}>
      <div aria-label="triangle" className="triangle" />
    </button>
  )
});

export const DropdownItem = memo(({item, onSelect, selectedItems, isActive, disabled, children}) => {
  const isSelected = selectedItems.includes(item);
  const handleClick = useCallback(() => {
    if(!disabled) onSelect(item)
    else alert("You can only add up to 5 countries.")
  }, [disabled, onSelect, item])

  return (
    <li 
      aria-label="dropdown-item"
      className={`dropdown-item ${isSelected ? "selected" : ""} ${isActive ? "active" : ''}`}
      onClick={handleClick}
    >
      {children}
    </li>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.item.id === nextProps.item.id &&
    prevProps.selectedItems.length === nextProps.selectedItems.length &&
    prevProps.selectedItems.includes(prevProps.item) === nextProps.selectedItems.includes(nextProps.item)
  );
})

const Dropdown = ({isOpen, activeIndex, disabled, ariaLabel}) => {
  const {filteredList, handleOnSelect, selectedItems} = useMultiSelect();

  if(!isOpen) return null;

  const onSelect = (item) => {
    handleOnSelect(item)
  }

  return (
    <>
      {isOpen && (
        <ul className="dropdown-list" ariaLabel={ariaLabel}>
          {filteredList.length > 0 ? filteredList.map((country, idx) => (
            <DropdownItem 
              key={country.id}
              item={country}
              onSelect={onSelect}
              selectedItems={selectedItems}
              isActive={idx === activeIndex}
              disabled={disabled}
              >{country.label}</DropdownItem>
          ))
            : <li aria-label="dropdown-list no-results" className="dropdown-item no-results">No results found</li>
          }
        </ul>
      )}
    </>
  )
}

export default Dropdown