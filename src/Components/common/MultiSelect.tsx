import React, { useState } from 'react';

interface MultiSelectProps {
    options: Record<string, string>;
    selectedOptions: { key: string, value: string }[]
    setSelectedOptions: React.Dispatch<React.SetStateAction<{ key: string; value: string }[]>>;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, selectedOptions, setSelectedOptions }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (key: string, value: string) => {
        if (!selectedOptions.find((option) => option.key === key)) {
            setSelectedOptions([...selectedOptions, { key, value }]);
        }
    };

    const handleRemove = (key: string) => {
        setSelectedOptions(selectedOptions.filter((selected) => selected.key !== key));
    };

    return (
        <div className="w-full flex flex-col items-center mx-auto">
            <div className="w-full">
                <div className="flex flex-col items-center relative">
                    <div className="w-full">
                        <div
                            className="my-2 p-1 flex border border-gray-200 bg-white rounded cursor-pointer"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <div className="flex flex-auto flex-wrap">
                                {selectedOptions.map((option) => (
                                    <div
                                        key={option.key}
                                        className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white border border-gray-300 rounded"
                                    >
                                        <div className="text-xs font-normal leading-none max-w-full flex-initial">{option.value}</div>
                                        <div className="flex flex-auto flex-row-reverse">
                                            <div onClick={() => handleRemove(option.key)}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="100%"
                                                    height="100%"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2"
                                                >
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {!selectedOptions.length && <button type='button'
                                className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-700 text-left"
                            >Select a category</button>}
                            <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200">
                                <button className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="100%"
                                        height="100%"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`feather feather-chevron-up w-4 h-4 ${isOpen ? 'transform rotate-180' : ''}`}
                                    >
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {isOpen && (
                            <div className="absolute shadow top-full bg-white z-40 w-full left-0 rounded max-h-select overflow-y-auto">
                                <div className="flex flex-col w-full">
                                    {Object.entries(options || {}).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className={`cursor-pointer w-full border-gray-100 ${selectedOptions.find((option) => option.key === key) ? 'hidden' : ''
                                                }`}
                                            onClick={() => handleSelect(key, value)}
                                        >
                                            <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-indigo-600">
                                                <div className="w-full items-center flex">
                                                    <div className="mx-2 leading-6">{value}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiSelect;
