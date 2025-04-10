// src/components/OptionSelector.jsx
function OptionSelector({ options, onSelect, disabled }) {
  return (
    <div className="option-selector">
      {options.map((option) => (
        <button key={option} onClick={() => onSelect(option)} disabled={disabled}>
          {option}
        </button>
      ))}
    </div>
  );
}

export default OptionSelector;