# CloudMCP-Style UI Integration

This document provides an overview of the CloudMCP-inspired liquid glass design implementation for SnakkaZ Chat.

## Design System

The new design system is implemented in `/src/styles/cloudmcp-liquid-glass.css` and provides:

- Frosted glass panels with variable transparency
- Soft, subtle shadows for depth
- Modern, clean typography
- Smooth animations and transitions
- Adaptive color schemes for light/dark mode
- Responsive design for all screen sizes

## New Components

### Profile Page (CloudMCP Style)

Located at `/src/pages/ProfilePageCloudMCP.jsx`

Features:
- User profile card with frosted glass effect
- Activity status indicators
- Profile image with animated hover effects
- Responsive layout for desktop and mobile
- Settings menu integration

Access at: `/cloudmcp-profile`

### Chat Page (CloudMCP Style)

Located at `/src/pages/ChatPageCloudMCP.jsx`

Features:
- Message bubbles with glass effect
- Animated typing indicators
- Smart layout for better readability
- WebRTC status integration
- MCP AI Memory integration
- Adaptive message threading

Access at: `/cloudmcp-chat`

## Integration Guide

To use the new CloudMCP-style components in your app:

1. Import the CSS: 
   ```css
   @import './styles/cloudmcp-liquid-glass.css';
   ```

2. Use the components in your routes:
   ```jsx
   <Route path="/your-path" element={<ProfilePageCloudMCP />} />
   <Route path="/your-chat" element={<ChatPageCloudMCP />} />
   ```

3. Customize by adding additional classes from the design system:
   - `.glass-panel` - Basic glass panel
   - `.glass-panel-light` - Lighter transparency
   - `.glass-panel-dark` - Darker transparency
   - `.glass-button` - Glass effect button
   - `.liquid-transition` - Smooth animation for elements

## Testing

Use the provided test script to quickly access the new components:

```bash
./test-cloudmcp-ui.sh
```

## Troubleshooting

### Database Issues

If you encounter database-related errors:

1. **Missing Tables Error**: 
   - Error: `relation "public.chat_rooms" does not exist` or `relation "public.mcp_connections" does not exist`
   - Solution: Run the database schema fix script:
     ```
     bash scripts/fix-database-schema.sh
     ```
   - Alternative: If service key is unavailable, use:
     ```
     bash scripts/manual-schema-fix.sh
     ```
     and follow the instructions to manually create tables in Supabase SQL Editor.

2. **Relationship Error**:
   - Error: `Could not find a relationship between 'chat_rooms' and 'created_by'`
   - Solution: Ensure your chat_rooms table has a proper foreign key reference:
     ```sql
     ALTER TABLE public.chat_rooms 
     ADD CONSTRAINT chat_rooms_created_by_fkey 
     FOREIGN KEY (created_by) REFERENCES public.profiles(id);
     ```

### React Warnings

If you see React warnings in the console:

1. **Multiple createRoot calls**:
   - Warning: `You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before`
   - Solution: The app has been updated to use a single createRoot call with proper error handling

2. **Font Loading Issues**:
   - Warning: `Request for font "X" blocked at visibility level 2`
   - Solution: This is a normal warning during development. Fonts will load correctly in production.

3. **Hot Reloading Issues**:
   - Problem: Changes to components don't appear when saved
   - Solution: Restart the development server with `npm run dev`

### UI Issues

If the CloudMCP style components don't render correctly:

1. Check CSS imports in index.css:
   ```css
   @import './styles/cloudmcp-liquid-glass.css';
   ```

2. Verify route configuration in App.tsx:
   ```jsx
   <Route path="/cloudmcp-profile" element={<ProfilePageCloudMCP />} />
   <Route path="/cloudmcp-chat" element={<ChatPageCloudMCP />} />
   ```

3. Try clearing browser cache or using incognito mode

4. Check for CSS conflicts by temporarily adding `!important` to key style properties

## Design Inspiration

The design is inspired by CloudMCP's interface and Telegram's modern UI principles, featuring:
- Minimalist, clean aesthetics
- Focus on content with reduced visual noise
- Subtle, purposeful animations
- Accessibility considerations for all users
