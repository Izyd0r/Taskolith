import React from 'react'

interface TextareaFieldProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string
    placeholder: string
}

export const TextareaField = React.forwardRef<
    HTMLTextAreaElement,
    TextareaFieldProps
>(({ id, placeholder, ...props }, ref) => {
    const className = `
    w-full px-4 py-3 bg-gray-200 text-gray-800 border border-gray-300 rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-blue-500
  `

    return (
        <div className="relative">
            <label htmlFor={id} className="sr-only">
                {placeholder}
            </label>
            <textarea
                id={id}
                ref={ref}
                placeholder={placeholder}
                className={className.trim()}
                rows={4}
                {...props}
            />
        </div>
    )
})

TextareaField.displayName = 'TextareaField'

export default TextareaField
