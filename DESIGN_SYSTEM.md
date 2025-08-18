# SnakkaZ Design System 2025

## Color Palette

```css
/* Primary Colors */
--primary-blue: #007aff; /* iOS Blue - trust, reliability */
--primary-green: #34c759; /* Success, online status */
--primary-red: #ff3b30; /* Error, urgent */

/* Neutral Colors */
--gray-50: #f9fafb; /* Light background */
--gray-100: #f3f4f6; /* Card backgrounds */
--gray-200: #e5e7eb; /* Borders */
--gray-400: #9ca3af; /* Muted text */
--gray-600: #4b5563; /* Body text */
--gray-900: #111827; /* Headings */

/* Chat Specific */
--message-sent: #007aff; /* Our messages */
--message-received: #f3f4f6; /* Others messages */
--message-text-sent: #ffffff;
--message-text-received: #000000;
```

## Typography

```css
/* Font Stack */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display",
  Roboto, sans-serif;

/* Scale */
--text-xs: 12px; /* Timestamps */
--text-sm: 14px; /* Secondary text */
--text-base: 16px; /* Body text */
--text-lg: 18px; /* Usernames */
--text-xl: 20px; /* Section headers */
--text-2xl: 24px; /* Page titles */
```

## Spacing System (8px Grid)

```css
--space-1: 4px; /* xs */
--space-2: 8px; /* sm */
--space-3: 12px; /* md */
--space-4: 16px; /* lg */
--space-6: 24px; /* xl */
--space-8: 32px; /* 2xl */
```

## Component Specifications

### Chat Bubble

- Border radius: 16px
- Padding: 12px 16px
- Max width: 70%
- Margin between: 8px
- Box shadow: 0 1px 2px rgba(0,0,0,0.1)

### Avatar

- Size: 32px (compact), 40px (normal)
- Border radius: 50%
- Placeholder: Initials or emoji

### Input Field

- Height: 44px (minimum touch target)
- Border radius: 22px
- Padding: 12px 16px
- Border: 1px solid var(--gray-200)
- Focus: border-color var(--primary-blue)

```

```
