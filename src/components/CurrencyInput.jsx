import React, { useState, useEffect } from 'react';

const formatNumber = (value) => {
  if (value === null || value === undefined) return '';
  const cleanValue = value.toString().replace(/\D/g, '');
  if (!cleanValue) return '';
  return parseInt(cleanValue, 10).toLocaleString('id-ID');
};

const CurrencyInput = ({
  value,
  onChange,
  placeholder = '0',
  className = 'zen-input',
  style = {},
  required = false,
  autoFocus = false
}) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    setDisplayValue(formatNumber(value));
  }, [value]);

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setDisplayValue(formatNumber(rawValue));

    if (onChange) {
      onChange(rawValue ? parseInt(rawValue, 10) : '');
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      className={className}
      style={style}
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      required={required}
      autoFocus={autoFocus}
    />
  );
};

export default CurrencyInput;
