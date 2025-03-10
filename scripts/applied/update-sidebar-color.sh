#!/bin/bash

# Script to update all sidebar/left panel backgrounds to #1A1E23
# This script will update the background color in layout components

# List of layout files to update
LAYOUT_FILES=(
  "./src/components/dashboard/DashboardLayout.jsx"
  "./src/components/dashboard/ActivityLayout.jsx"
  "./src/components/billing/BillingLayout.jsx"
)

echo "Updating sidebar background color to #1A1E23 in ${#LAYOUT_FILES[@]} layout files"

for FILE in "${LAYOUT_FILES[@]}"; do
  echo "Processing $FILE"
  
  # Update the sidebar background color class
  # Look for bg-dark-card in the sidebar/panel div and replace with bg-[#1A1E23]
  sed -i '' 's/className="bg-dark-card rounded-2xl/className="bg-[#1A1E23] rounded-2xl/g' "$FILE"
  
  # Update hover states for menu items to use the same color but slightly lighter
  sed -i '' 's/hover:bg-dark-card\/70/hover:bg-[#252A31]/g' "$FILE"
  
  echo "  Updated sidebar background in $FILE"
done

echo "Sidebar color update complete!"
