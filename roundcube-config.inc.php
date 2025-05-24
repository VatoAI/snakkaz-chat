<?php
// Roundcube configuration file for mail.snakkaz.com
// Place this file at /home/snakqsqe/mail.snakkaz.com/config/config.inc.php

// Database connection string (DSN) for read+write operations
$config['db_dsnw'] = 'mysql://snakqsqe_roun765:!SY6c(KN]2p6@o.4@localhost/snakqsqe_roun765';

// IMAP server host (SSL/TLS is required)
$config['default_host'] = 'ssl://mail.snakkaz.com';

// SMTP server host (use same as IMAP host)
$config['smtp_server'] = 'tls://mail.snakkaz.com';

// SMTP port
$config['smtp_port'] = 587;

// SMTP username and password authentication
$config['smtp_user'] = '%u';
$config['smtp_pass'] = '%p';

// Use user's email address as the SMTP sender
$config['smtp_from'] = '';
$config['smtp_user_identity'] = '';

// Support email address
$config['support_url'] = 'mailto:help@snakkaz.com';

// Set default language to Norwegian
$config['language'] = 'nb_NO';

// List of active plugins
$config['plugins'] = array(
    'archive',
    'zipdownload',
    'password',
    'managesieve',
    'markasjunk',
    'newmail_notifier',
);

// Improve session security
$config['session_lifetime'] = 30; // 30 minutes
$config['session_storage'] = 'db';
$config['ip_check'] = true;

// Skin settings
$config['skin'] = 'elastic';
$config['skin_logo'] = 'https://www.snakkaz.com/assets/img/logo.png';

// Enable debug logging for troubleshooting
$config['debug_level'] = 1; // Set to 0 in production
$config['smtp_debug'] = true; // Set to false in production
$config['imap_debug'] = true; // Set to false in production
$config['ldap_debug'] = true; // Set to false in production
$config['smtp_log'] = true; // Set to false in production

// Fix for the "Invalid request" errors - increase session security
$config['session_domain'] = 'mail.snakkaz.com';
$config['use_https'] = true;
$config['enable_installer'] = false;
$config['check_referer'] = false; // Temporarily disable referer checking

// Do not show errors to users
$config['display_errors'] = false;

// Error and debug logs configuration
$config['log_dir'] = '/home/snakqsqe/mail.snakkaz.com/logs/';
$config['syslog_facility'] = LOG_MAIL;
