#!/usr/bin/env bash
#
# This script provides a one-command setup and startup for the entire application.
# It handles prerequisite checks, certificate generation, and container orchestration.
#
set -e

# --- Configuration ---
DOMAIN="localhost"
CERT_DIR="./nginx/certs"
DAYS_VALID=365
ENV_FILE=".env"
ENV_EXAMPLE_FILE=".env.example"

# --- Main Logic ---

echo "--- Taskolith Application Startup Script ---"

# Step 1: Create the .env file from the example if it doesn't exist.
if [ ! -f "$ENV_FILE" ]; then
  echo "[1/6] Configuration file '$ENV_FILE' not found."
  echo "      Creating a new one from the example file..."
  cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
  echo "      SUCCESS: '$ENV_FILE' created."
else
  echo "[1/6] Configuration file '$ENV_FILE' already exists. Skipping creation."
fi

# Step 2: Stop any old running containers and remove their volumes for a clean start.
echo "[2/6] Performing a clean shutdown of any previous instances..."
# The '-v' flag is crucial to remove the old postgres data to prevent credential conflicts.
docker compose down -v --remove-orphans || true
echo "      SUCCESS: Environment is clean."

# Step 3: Generate self-signed SSL certificates if they don't exist.
if [ ! -f "$CERT_DIR/privkey.pem" ] || [ ! -f "$CERT_DIR/fullchain.pem" ]; then
  echo "[3/6] SSL certificate not found. Generating a new self-signed certificate..."
  mkdir -p "$CERT_DIR"
  
  # Use MSYS_NO_PATHCONV=1 to prevent Git Bash from mangling path arguments.
  MSYS_NO_PATHCONV=1 docker compose run --rm openssl req -x509 -nodes -newkey rsa:2048 \
    -keyout "/certs/privkey.pem" \
    -out "/certs/fullchain.pem" \
    -days "$DAYS_VALID" \
    -subj "/CN=$DOMAIN" >/dev/null 2>&1
  
  echo "      SUCCESS: Certificate generated."
else
  echo "[3/6] SSL certificate already exists. Skipping generation."
fi

# Step 4: Build the Docker images for all services.
echo "[4/6] Building Docker images (this may take a few minutes on the first run)..."
docker compose build

# Step 5: Start all services in detached (background) mode.
echo "[5/6] Starting all application services..."
docker compose up -d

# Step 6: Provide final instructions to the user.
echo "[6/6] Waiting for services to initialize..."
sleep 10 # Allow time for the database to start and accept connections.

echo ""
echo "------------------------------------------------------------------"
echo "Setup Complete. The application is now running."
echo ""

# Detect if running in WSL to provide the correct IP address.
if [ -n "$WSL_DISTRO_NAME" ]; then
  WSL_IP=$(ip addr show eth0 | grep "inet " | awk '{print $2}' | cut -d/ -f1)
  echo "To access the application, open your web browser and go to:"
  echo "    https://$WSL_IP"
else
  echo "To access the application, open your web browser and go to:"
  echo "    https://localhost"
fi

echo ""
echo "IMPORTANT: You will see a browser security warning. This is expected."
echo "Why this happens: The application uses a self-signed SSL certificate for"
echo "local HTTPS, which browsers do not trust by default."
echo ""
echo "How to proceed:"
echo "  - Click the 'Advanced' or 'Show Details' button."
echo "  - Click 'Proceed to localhost (unsafe)' or 'Accept the Risk and Continue'."
echo ""
echo "------------------------------------------------------------------"
echo "To view live application logs, run: docker compose logs -f"
echo "To stop the application, run:      docker compose down"
echo "------------------------------------------------------------------"