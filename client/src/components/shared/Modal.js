import React from 'react';

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    {onClose && (
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none font-semibold">
                            &times;
                        </button>
                    )}
                </div>
                <div className="text-gray-700">{children}</div>
            </div>
        </div>
    );
}

export default Modal;