# Taskolith: A Full-Stack Task Management Application

Taskolith is a modern, containerized, full-stack web application designed for managing tasks and projects. Built with a robust ASP.NET Core backend, a responsive React frontend, and orchestrated entirely with Docker.

The entire environment is configured to be "plug and play," allowing anyone with Docker to get the application running with a single command.

## Key Features

*   **User Authentication:** Secure user registration and login functionality.
*   **Full CRUD Operations:** Create, read, update, and delete tasks and projects.
*   **SPA Frontend:** A fast and modern single-page application built with React and Vite.
*   **Containerized Environment:** All services (backend, frontend, database, reverse proxy) are containerized using Docker for consistency and portability.
*   **HTTPS Locally:** Nginx is configured as a reverse proxy to serve the application over HTTPS, mimicking a production environment.

## Tech Stack

| Area                 | Technologies                                           |
| -------------------- | ------------------------------------------------------ |
| **Backend**          | C#, ASP.NET Core Web API, Entity Framework Core        |
| **Frontend**         | TypeScript, React, Vite, Tailwind CSS                  |
| **Database**         | PostgreSQL                                             |
| **DevOps & Hosting** | Docker, Docker Compose, Nginx (as Reverse Proxy)       |

---

## Prerequisites

Before you begin, ensure you have the following software installed and configured on your local machine.

1.  **Docker Desktop**
    *   This is the core requirement for running the application. Docker will manage all the services, databases, and networking.
    *   [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

2.  **WSL 2 Integration (For Windows Users)**
    *   If you are on Windows, it is crucial that Docker Desktop is configured to use the WSL 2 backend.
    *   To enable this, go to Docker Desktop **Settings > Resources > WSL Integration** and ensure your primary Linux distribution is enabled.

3.  **Git**
    *   Required to clone the repository to your machine.
    *   [Download Git](https://git-scm.com/downloads)

4.  **A Terminal / Command-Line Interface**
    *   You will need a terminal to run the setup script.
    *   Examples: Git Bash (recommended on Windows), PowerShell, or any native Linux/macOS terminal.

---

## Getting Started

The project is designed to be set up with a single command.

#### 1. Clone the Repository
First, clone this repository to your local machine.
```bash
git clone https://github.com/your-username/taskolith.git
cd taskolith
```

#### 2. Make the Startup Script Executable
In your terminal, you need to give the `run.sh` script permission to execute.
```bash
chmod +x run.sh
```

#### 3. Run the Application
Execute the script. This will handle everything: creating configuration files, generating a local SSL certificate, building the Docker images, and starting all services.
```bash
./run.sh
```
The first time you run this, it may take several minutes to download the base Docker images and build the application containers. Subsequent runs will be much faster.

Upon completion, the script will print the exact URL to access the application.

### Accessing the Application

When you first navigate to the provided URL (e.g., `https://localhost`), your browser will display a security warning page with a message like "Your connection is not private".

**This is expected behavior.** It occurs because the application uses a self-signed SSL certificate for local development to enable HTTPS. Since this certificate is not issued by a trusted public Certificate Authority, your browser correctly flags it.

**To proceed to the application, please follow these steps:**
1.  Click the **"Advanced"** button on the warning page.
2.  Click the link that says **"Proceed to [address] (unsafe)"** or **"Accept the Risk and Continue"**.

You will now be able to view and interact with the Taskolith application.