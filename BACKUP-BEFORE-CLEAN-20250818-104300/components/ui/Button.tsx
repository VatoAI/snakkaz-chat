import React from 'react';
import './Button.css';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: string;
    iconPosition?: 'left' | 'right';
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    onClick,
    type = 'button',
    className = ''
}) => {
    const buttonClasses = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? 'btn-full-width' : '',
        loading ? 'btn-loading' : '',
        disabled ? 'btn-disabled' : '',
        className
    ].filter(Boolean).join(' ');

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && !loading && onClick) {
            onClick(e);
        }
    };

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={handleClick}
            disabled={disabled || loading}
        >
            {loading && (
                <div className="btn-spinner">
                    <div className="spinner"></div>
                </div>
            )}

            {!loading && (
                <>
                    {icon && iconPosition === 'left' && (
                        <span className="btn-icon btn-icon-left">{icon}</span>
                    )}

                    <span className="btn-text">{children}</span>

                    {icon && iconPosition === 'right' && (
                        <span className="btn-icon btn-icon-right">{icon}</span>
                    )}
                </>
            )}
        </button>
    );
};

export default Button;
