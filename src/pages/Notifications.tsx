import React from 'react';
import './Notifications.css';

const Notifications: React.FC = () => {
    return (
        <div className="notifications">
            <div className="notifications-header">
                <h1>Notifications</h1>
                <p>Stay updated with your latest activities</p>
            </div>

            <div className="notifications-filter">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Messages</button>
                <button className="filter-btn">System</button>
                <button className="filter-btn">Groups</button>
            </div>

            <div className="notifications-list">
                <div className="notification-item unread">
                    <div className="notification-avatar">💬</div>
                    <div className="notification-content">
                        <div className="notification-title">New message from John</div>
                        <div className="notification-message">Hey! How are you doing today?</div>
                        <div className="notification-time">2 minutes ago</div>
                    </div>
                    <div className="notification-dot"></div>
                </div>

                <div className="notification-item unread">
                    <div className="notification-avatar">👥</div>
                    <div className="notification-content">
                        <div className="notification-title">Group Chat: Design Team</div>
                        <div className="notification-message">Sarah added you to the group</div>
                        <div className="notification-time">5 minutes ago</div>
                    </div>
                    <div className="notification-dot"></div>
                </div>

                <div className="notification-item">
                    <div className="notification-avatar">🔔</div>
                    <div className="notification-content">
                        <div className="notification-title">System Update</div>
                        <div className="notification-message">SnakkaZ has been updated to version 1.0.1</div>
                        <div className="notification-time">1 hour ago</div>
                    </div>
                </div>

                <div className="notification-item">
                    <div className="notification-avatar">💬</div>
                    <div className="notification-content">
                        <div className="notification-title">New message from Emma</div>
                        <div className="notification-message">Thanks for the help with the project!</div>
                        <div className="notification-time">2 hours ago</div>
                    </div>
                </div>

                <div className="notification-item">
                    <div className="notification-avatar">👥</div>
                    <div className="notification-content">
                        <div className="notification-title">Group Chat: Family</div>
                        <div className="notification-message">Mom: Don't forget dinner tonight!</div>
                        <div className="notification-time">3 hours ago</div>
                    </div>
                </div>

                <div className="notification-item">
                    <div className="notification-avatar">🔒</div>
                    <div className="notification-content">
                        <div className="notification-title">Security Alert</div>
                        <div className="notification-message">New device login detected from iPhone</div>
                        <div className="notification-time">Yesterday</div>
                    </div>
                </div>

                <div className="notification-item">
                    <div className="notification-avatar">💬</div>
                    <div className="notification-content">
                        <div className="notification-title">New message from Mike</div>
                        <div className="notification-message">Great work on the presentation!</div>
                        <div className="notification-time">Yesterday</div>
                    </div>
                </div>

                <div className="notification-item">
                    <div className="notification-avatar">🎉</div>
                    <div className="notification-content">
                        <div className="notification-title">Welcome to SnakkaZ!</div>
                        <div className="notification-message">Your account has been successfully created</div>
                        <div className="notification-time">2 days ago</div>
                    </div>
                </div>
            </div>

            <div className="notifications-actions">
                <button className="action-btn secondary">Mark All as Read</button>
                <button className="action-btn primary">Clear All</button>
            </div>
        </div>
    );
};

export default Notifications;
