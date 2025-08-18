import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

interface DropdownItem {
    id: string;
    label: string;
    icon?: string;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
    separator?: boolean;
}

interface DropdownProps {
    trigger: React.ReactNode;
    items: DropdownItem[];
    position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
    className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    trigger,
    items,
    position = 'bottom-right',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleItemClick = (item: DropdownItem) => {
        if (!item.disabled) {
            item.onClick();
            setIsOpen(false);
        }
    };

    const dropdownClasses = [
        'dropdown',
        className
    ].filter(Boolean).join(' ');

    const menuClasses = [
        'dropdown-menu',
        `dropdown-${position}`,
        isOpen ? 'dropdown-open' : ''
    ].join(' ');

    return (
        <div className={dropdownClasses} ref={dropdownRef}>
            <div
                ref={triggerRef}
                className="dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                {trigger}
            </div>

            {isOpen && (
                <div className={menuClasses}>
                    {items.map((item, index) => (
                        <React.Fragment key={item.id}>
                            {item.separator && index > 0 && <div className="dropdown-separator" />}
                            <button
                                className={`dropdown-item ${item.danger ? 'dropdown-item-danger' : ''} ${item.disabled ? 'dropdown-item-disabled' : ''}`}
                                onClick={() => handleItemClick(item)}
                                disabled={item.disabled}
                            >
                                {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}
                                <span className="dropdown-item-label">{item.label}</span>
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
