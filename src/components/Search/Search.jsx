import React, {memo} from 'react';
import { useMultiSelect } from '../../context/MultiSelectContext';
import {DropdownButton} from '../Dropdown/Dropdown';
import './Search.css';

const InputItem = memo(({item, ariaLabel}) => {
  const {handleRemoveItem} = useMultiSelect(); 
  return (
    <div className="search-item" aria-label={ariaLabel}>
      <span className="search-item-label" aria-label="search-item-label">{item.label}</span>
      <span className="search-item-remove" aria-label="search-item-remove" onClick={() => handleRemoveItem(item)}>X</span>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item === nextProps.item
  )
})

const ClearButton = ({onClear}) => {
  return <button className="clear-button" aria-label="clear-button" onClick={onClear}>Clear</button>
}

const Input = ({placeholder, ariaLabel, ref, onFocus, onClear, selectedItems}) => {
  const {searchValue, handleOnChange} = useMultiSelect();
  return ( 
    <div className="input-container" aria-label="input-container">
      <div className="search-item-container" aria-label="search-item-container">
        {selectedItems?.length > 0 && (
            selectedItems.map((country, idx) => (
              <InputItem
                key={idx}
                item={country}
                ariaLabel="search-item-input-item"
              />
            ))
          )}
      </div>
      <input
        ref={ref}
        onFocus={onFocus}
        className="input"
        placeholder={placeholder}
        value={searchValue}
        type="text"
        aria-label={ariaLabel}
        onChange={(e) => handleOnChange(e.target.value)}
      />
      <div className="button-container" aria-label="button-container-dropdown">
        <DropdownButton />
        {selectedItems?.length > 0 && (<ClearButton onClear={onClear}/>)}
      </div>
    </div>
  );
}

const Search = () => {
  const {handleOnClear, selectedItems, onFocus, ref} = useMultiSelect();
  return (
    <>
      <Input 
        ref={ref}
        placeholder="Search..."
        selectedItems={selectedItems}
        onClear={handleOnClear}
        onFocus={onFocus}
        ariaLabel="search-item-input"
      />
    </>
  )
}

export default Search