#!/bin/bash
# Fix common import path issues

echo "Fixing import paths..."

# Fix theme imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from ['"'"'"][.][.]/lib/theme['"'"'"]|from "@/lib/theme"|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from ['"'"'"]\.\./\.\./lib/theme['"'"'"]|from "@/lib/theme"|g'

# Fix UserAvatar imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from ['"'"'"]\.\./header/UserAvatar['"'"'"]|from "@/components/chat/header/UserAvatar"|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from ['"'"'"]\.\./\.\./header/UserAvatar['"'"'"]|from "@/components/chat/header/UserAvatar"|g'

# Fix hooks imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from ['"'"'"]\.\./\.\./hooks/|from "@/hooks/|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from ['"'"'"]\.\./hooks/|from "@/hooks/|g'

# Fix components imports 
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from ['"'"'"]\.\./\.\./components/|from "@/components/|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from ['"'"'"]\.\./components/|from "@/components/|g'

# Fix services imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from ['"'"'"]\.\./\.\./services/|from "@/services/|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from ['"'"'"]\.\./services/|from "@/services/|g'

# Fix utils imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from ['"'"'"]\.\./\.\./utils/|from "@/utils/|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from ['"'"'"]\.\./utils/|from "@/utils/|g'

# Fix types imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from ['"'"'"]\.\./\.\./types/|from "@/types/|g'
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|from ['"'"'"]\.\./types/|from "@/types/|g'

echo "Import path fixes completed!"
