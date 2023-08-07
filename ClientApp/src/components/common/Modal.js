import React from 'react';

const CustomModal = ({ isOpen, onClose, title, children }) => {
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="custom-modal" onClick={handleBackgroundClick}>
            <div className="custom-modal-content">
                <span className="custom-modal-close" onClick={onClose}>&times;</span>
                <div className="custom-modal-title">{title}</div>
                <div className="custom-modal-body">{children}</div>
            </div>
        </div>
    );
};

export default CustomModal;
