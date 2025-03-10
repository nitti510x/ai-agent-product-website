#!/bin/bash

# Script to update all right-side content panels to use the color #1A1E23
# This script will NOT change the left sidebar color

echo "Updating right-side content panels to use color #1A1E23"

# Update panels with specific background colors
echo "Updating panels with #1d2127 background"
grep -r "bg-\[#1d2127\]" --include="*.jsx" ./src/ | cut -d: -f1 | sort | uniq | while read file; do
  echo "  Processing $file"
  sed -i '' 's/bg-\[#1d2127\]/bg-\[#1A1E23\]/g' "$file"
done

# Update panels with the default bg-dark-card class (but not in sidebar/layout components)
echo "Updating panels with bg-dark-card class (excluding sidebar components)"
grep -r "bg-dark-card rounded-2xl shadow-2xl border" --include="*.jsx" ./src/ | grep -v "Layout.jsx" | cut -d: -f1 | sort | uniq | while read file; do
  echo "  Processing $file"
  sed -i '' 's/bg-dark-card rounded-2xl/bg-\[#1A1E23\] rounded-2xl/g' "$file"
done

echo "Content panel color update complete!"
