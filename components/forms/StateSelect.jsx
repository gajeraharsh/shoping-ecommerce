import { useEffect } from 'react';
import states from '../../data/india-states.json';

export default function StateSelect({
  id = 'state',
  name = 'state',
  value,
  onChange,
  error,
  className = '',
  placeholder = 'Select State',
  required = false,
  onBlur,
}) {
  // Build helpers to normalize incoming values
  const codeSet = new Set(states.map((s) => s.code));
  const nameToCode = states.reduce((acc, s) => {
    acc[s.name] = s.code;
    return acc;
  }, {});

  // Normalize provided value: support legacy values saved as full state names
  const normalizedValue = value
    ? codeSet.has(value)
      ? value
      : nameToCode[value] || ''
    : '';

  // Push normalized code value back to parent if incoming value was a name
  useEffect(() => {
    if (value && normalizedValue && value !== normalizedValue && typeof onChange === 'function') {
      onChange({ target: { name, value: normalizedValue } });
    }
  }, [value, normalizedValue, name, onChange]);

  return (
    <select
      id={id}
      name={name}
      value={normalizedValue}
      onChange={onChange}
      onBlur={onBlur}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      required={required}
      className={`w-full px-4 py-3 min-h-[48px] border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-white bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
        error ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
      } ${className}`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {states.map((s) => (
        <option key={s.code} value={s.code}>
          {s.name}
        </option>
      ))}
    </select>
  );
}
