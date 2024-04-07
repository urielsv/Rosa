#!/bin/bash

# Function to check if a command exists
command_exists () {
    type "$1" &> /dev/null ;
}

# Check if the operating system is Darwin (macOS)
if [[ "$(uname -s)" == "Darwin" ]]; then
    echo "Running on macOS"

    # Check if Homebrew is installed
    if command_exists brew ; then
        echo "Homebrew is installed"
    else
        echo "Homebrew is not installed. Installing now..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi

    # Check if Google Chrome is installed
    if brew list --cask google-chrome > /dev/null 2>&1; then
        echo "Google Chrome is already installed"
    else
        echo "Google Chrome is not installed. Installing now..."
        brew install --cask google-chrome
    fi
else
    echo "Not running on macOS. Skipping Homebrew and Google Chrome installation..."
fi

# Install Node.js dependencies and build the project
echo "Installing Node.js dependencies in /app and /backend, and building the project in /manager..."

cd /app && npm install --production && echo "Installed Node.js dependencies in /app"
cd /backend && npm install --production && echo "Installed Node.js dependencies in /backend"
cd /manager && npm install --production && npm run build && echo "Built the project in /manager"

echo "Installation process completed. Start with ./start.sh"