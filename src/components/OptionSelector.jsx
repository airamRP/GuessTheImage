// src/components/OptionSelector.jsx
import { memo } from 'react';
import './OptionSelector.css';

function OptionSelector({ options, onSelect, disabled }) {
  return (
    <div className="option-selector">
      <div className="options">
        {options.map((option) => (
          <button key={option} onClick={() => onSelect(option)} disabled={disabled}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default memo(OptionSelector);