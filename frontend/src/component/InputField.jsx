import React from 'react';

const InputField = ({ as: Component = 'input', label, type = 'text', ...props }) => {
  return (
    <div>
      <label htmlFor={props.name} className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <Component
        id={props.name}
        type={type}
        className="block w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        {...props}
      />
    </div>
  );
};

export default InputField;