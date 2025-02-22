import React, {memo} from 'react';
import { useMultiSelect } from '../../context/MultiSelectContext';
import {DropdownButton} from '../Dropdown/Dropdown';
import './Search.css';

const InputItem = memo(({item}) => {
  const {handleRemoveItem} = useMultiSelect(); 
  return (
    <div className="search-item">
      <span className="search-item-label">{item.label}</span>
      <span className="search-item-remove" onClick={() => handleRemoveItem(item)}>X</span>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item === nextProps.item
  )
})

const ClearButton = ({onClear}) => {
  return <button className="clear-button" onClick={onClear}>Clear</button>
}

const Input = ({placeholder, ref, onFocus, onClear, selectedItems}) => {
  const {searchValue, handleOnChange} = useMultiSelect();
  return ( 
    <div className="input-container">
      <div className="search-item-container">
        {selectedItems?.length > 0 && (
            selectedItems.map((country, idx) => (
              <InputItem
                key={idx}
                item={country} 
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
        aria-label="search-item-input"
        onChange={(e) => handleOnChange(e.target.value)}
      />
      <div className="button-container">
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
      />
    </>
  )
}

export default Search