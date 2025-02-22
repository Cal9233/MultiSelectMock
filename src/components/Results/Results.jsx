import React from 'react';
import './Results.css';
import { useMultiSelect } from '../../context/MultiSelectContext';

const Results = () => {
    const {selectedItems} = useMultiSelect()
  return (
    <div className="results-container" aria-label="results-container">
      {selectedItems.length> 0 && selectedItems.map((country) => (
        <div key={country.id}>{country.label}</div>
      ))}
    </div>
  )
}

export default Results