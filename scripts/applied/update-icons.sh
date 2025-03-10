#!/bin/bash

# Script to update all IoDiamond icons to FaRobot icons
# This script will:
# 1. Update all import statements
# 2. Update all instances of IoDiamond components

# Find all files that import IoDiamond
FILES=$(grep -r "import { IoDiamond } from 'react-icons/io5'" ./src/ | cut -d: -f1)

echo "Found $(echo "$FILES" | wc -l | tr -d ' ') files to update"

for FILE in $FILES; do
  echo "Processing $FILE"
  
  # Skip our prototype files
  if [[ "$FILE" == *"RobotIconOptions.jsx"* ]] || [[ "$FILE" == *"TokenIconPrototype.jsx"* ]]; then
    echo "Skipping prototype file: $FILE"
    continue
  fi
  
  # 1. Add FaRobot import if it doesn't exist
  if ! grep -q "import { FaRobot } from 'react-icons/fa6'" "$FILE"; then
    sed -i '' 's/import { IoDiamond } from '\''react-icons\/io5'\'';/import { IoDiamond } from '\''react-icons\/io5'\'';\'$'\nimport { FaRobot } from '\''react-icons\/fa6'\'';/' "$FILE"
    echo "  Added FaRobot import to $FILE"
  fi
  
  # 2. Replace all IoDiamond components with FaRobot
  sed -i '' 's/<IoDiamond/<FaRobot/g' "$FILE"
  echo "  Replaced IoDiamond components with FaRobot in $FILE"
done

echo "Icon update complete!"
