import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    placeholder: string;
    toggle?: React.ReactNode;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ id, type = 'text', placeholder, toggle, ...props }, ref) => {
        const inputClassName = `
      w-full px-4 py-3 bg-gray-200 text-gray-800 border border-gray-300 rounded-lg 
      focus:outline-none focus:ring-2 focus:ring-blue-500
      ${toggle ? 'pr-12' : ''} 
    `;

        return (
            <div className="relative">
                <label htmlFor={id} className="sr-only">{placeholder}</label>
                <input
                    id={id}
                    type={type}
                    className={inputClassName.trim()}
                    placeholder={placeholder}
                    ref={ref}
                    {...props}
                />
                {toggle && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        {toggle}
                    </div>
                )}
            </div>
        );
    }
);

InputField.displayName = 'InputField';

export default InputField;
