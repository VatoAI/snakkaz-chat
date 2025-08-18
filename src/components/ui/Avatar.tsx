import React, { useState } from 'react';
import './Avatar.css';

interface AvatarProps {
    src?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'away' | 'busy';
    showStatus?: boolean;
    editable?: boolean;
    onClick?: () => void;
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
    src,
    name = 'User',
    size = 'md',
    status = 'offline',
    showStatus = false,
    editable = false,
    onClick,
    className = ''
}) => {
    const [imageError, setImageError] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const avatarClasses = [
        'avatar',
        `avatar-${size}`,
        editable ? 'avatar-editable' : '',
        onClick ? 'avatar-clickable' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={avatarClasses} onClick={onClick}>
            <div className="avatar-image">
                {src && !imageError ? (
                    <img
                        src={src}
                        alt={name}
                        onError={handleImageError}
                    />
                ) : (
                    <div className="avatar-initials">
                        {getInitials(name)}
                    </div>
                )}

                {editable && (
                    <div className="avatar-edit-overlay">
                        <span>✏️</span>
                    </div>
                )}
            </div>

            {showStatus && (
                <div className={`avatar-status avatar-status-${status}`} />
            )}
        </div>
    );
};

export default Avatar;
