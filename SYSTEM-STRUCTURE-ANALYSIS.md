# SnakkaZ System Structure Analysis 🔍

## Current Problem
The app displays broken design because the code references CSS classes that don't exist:
- `liquid-primary` (used but not defined as CSS class)
- `snakkaz-liquid-glass` (not defined)
- `glass-crystal` (not defined)

## File Structure Analysis

### 📁 Main Project (Current)
```
/workspaces/snakkaz-chat/
├── src/
│   ├── App.tsx                              # Complex routing with device detection
│   ├── pages/SnakkaZChatBeta.tsx           # Uses undefined CSS classes ❌
│   ├── styles/MASTER-DESIGN-SYSTEM.css     # 717 lines, missing classes ❌
│   └── main.tsx                            # Imports NorwegianAurora.css
├── vite.config.ts                          # Had @emotion/react issue (fixed)
├── package.json                            # Complex, 200+ lines
└── tailwind.config.ts                      # May conflict with CSS
```

### 📁 Lost Versions (From Git)
```
snakkaz-fixed/                              # DELETED - Was simpler version ✅
├── package.json                            # Only 4 dependencies
├── src/App.tsx                             # Simple login with TestSprite
└── src/NorwegianAurora.css                 # Complete, working CSS

snakkaz-v2/                                 # DELETED - Was enhanced version
├── Multiple components
└── Enhanced features
```

### 📁 Backup (Available)
```
BACKUP-20250728/                            # All original files moved here
├── src/                                    # Original complex structure
└── ...                                     # All original files
```

## CSS System Issues

### ❌ Current Problems
1. **Missing CSS Variables:**
   ```css
   /* Used but not defined */
   --liquid-primary
   --liquid-secondary
   ```

2. **Missing CSS Classes:**
   ```css
   /* Used in SnakkaZChatBeta.tsx but not defined */
   .liquid-primary
   .snakkaz-liquid-glass  
   .glass-crystal
   ```

3. **Defined Variables:**
   ```css
   /* Available in MASTER-DESIGN-SYSTEM.css */
   --snakkaz-primary: #64b5f6
   --snakkaz-secondary: #4dd0e1
   --glass-bg, --glass-border, etc.
   ```

### ✅ Working CSS (from snakkaz-fixed)
```css
/* Complete aurora theme */
--aurora-blue: #4facfe
--aurora-cyan: #00f2fe
--aurora-green: #00ff88
/* + Full class definitions */
```

## Dependencies Analysis

### Current (Complex)
- 70+ dependencies
- Radix UI components
- Complex routing
- Multiple integrations

### snakkaz-fixed (Simple)
- 4 dependencies only
- Basic React setup
- Clean implementation

## Solutions

### Option 1: Fix Current CSS ⚡
- Add missing CSS variables and classes
- Map liquid-* to snakkaz-* variables
- Quick fix, keep current structure

### Option 2: Restore snakkaz-fixed 🔄
- Git restore the simple working version
- Simpler, proven to work
- Lose current features

### Option 3: Hybrid Approach 🎯
- Use snakkaz-fixed CSS in current project
- Best of both worlds

## Recommended Action
**Fix CSS classes in current system** - quickest path to working state.