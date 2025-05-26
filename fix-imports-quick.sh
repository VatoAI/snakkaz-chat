#!/bin/bash

# Hurtig import-fiks for å få appen til å fungere
echo "Fikser ødelagte importstier..."

PROJECT_ROOT="/workspaces/snakkaz-chat"

# Funksjon for å finne hvor filer faktisk er
find_actual_file() {
    local filename="$1"
    find "$PROJECT_ROOT/src" -name "$filename.tsx" -o -name "$filename.ts" | grep -v backup | head -1
}

# Funksjon for å oppdatere import i en fil
fix_import_in_file() {
    local file_path="$1"
    local old_import="$2"
    local new_import="$3"
    
    if [[ -f "$file_path" ]]; then
        sed -i "s|$old_import|$new_import|g" "$file_path"
        echo "Fikset import i $file_path: $old_import -> $new_import"
    fi
}

# MessageList fiks
MESSAGELIST_ACTUAL=$(find_actual_file "MessageList")
if [[ -n "$MESSAGELIST_ACTUAL" ]]; then
    MESSAGELIST_IMPORT_PATH=$(echo "$MESSAGELIST_ACTUAL" | sed "s|$PROJECT_ROOT/src/||" | sed "s|\.tsx$||")
    
    # Finn alle filer som importerer MessageList feil
    grep -r "from.*components/chat/MessageList" "$PROJECT_ROOT/src" --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort -u | while read -r file; do
        fix_import_in_file "$file" "from.*components/chat/MessageList" "from '@/$MESSAGELIST_IMPORT_PATH'"
    done
fi

# ChatMessage fiks
CHATMESSAGE_ACTUAL=$(find_actual_file "ChatMessage")
if [[ -n "$CHATMESSAGE_ACTUAL" ]]; then
    CHATMESSAGE_IMPORT_PATH=$(echo "$CHATMESSAGE_ACTUAL" | sed "s|$PROJECT_ROOT/src/||" | sed "s|\.tsx$||")
    
    grep -r "from.*components/chat/ChatMessage" "$PROJECT_ROOT/src" --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort -u | while read -r file; do
        fix_import_in_file "$file" "from.*components/chat/ChatMessage" "from '@/$CHATMESSAGE_IMPORT_PATH'"
    done
fi

# ChatInterface fiks
CHATINTERFACE_ACTUAL=$(find_actual_file "ChatInterface")
if [[ -n "$CHATINTERFACE_ACTUAL" ]]; then
    CHATINTERFACE_IMPORT_PATH=$(echo "$CHATINTERFACE_ACTUAL" | sed "s|$PROJECT_ROOT/src/||" | sed "s|\.tsx$||")
    
    grep -r "from.*components/chat/ChatInterface" "$PROJECT_ROOT/src" --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort -u | while read -r file; do
        fix_import_in_file "$file" "from.*components/chat/ChatInterface" "from '@/$CHATINTERFACE_IMPORT_PATH'"
    done
fi

echo "Import-fikser fullført!"
