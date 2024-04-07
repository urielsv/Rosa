#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pkill node # TEMP

# Start the backend
cd $DIR/backend && node . &
echo "Backend started @ https://localhost:80"

# # Start the manager
cd $DIR/manager && npm start &
echo "Manager started @ https://localhost:3000"

# # Start the app
cd $DIR/app && node . &
echo "App started"

