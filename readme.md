# rMart-Backend

## Overview

This repository contains the microservice backend for the rMart app, a food ordering service. It's composed of several services working together to provide a comprehensive backend functionality:

- **Mart Service:** Handles food orders, including creating, processing, and managing orders.
- **Profile Service:** Manages user profiles, including login, signup, and user data management.
- **Email Service:** Sends notifications via email, such as order confirmations and status updates.
- **Job Service:** Handles failed orders and refunds, ensuring timely resolution of issues.
- **Nginx:** Acts as a reverse proxy, routing requests to the appropriate services and providing load balancing.
## Architecture

The microservice architecture offers flexibility, scalability, and independent development and deployment of services.

[![diagram-export-12-31-2023-8-51-36-PM.png](https://i.postimg.cc/tT0hND8H/diagram-export-12-31-2023-8-51-36-PM.png)](https://postimg.cc/qtLhkckm)

## Technologies Used

- **Node.js:** Backend development framework.
- **Docker:** Containerization platform for packaging and deploying services.
- **Docker Compose:** Tool for defining and running multi-container Docker applications.
- **Nginx:** Reverse proxy and load balancer.

## Getting Started

1. Prerequisites:

  - Docker and Docker Compose installed.
  - Node.js and npm (or yarn) installed.

2. Clone the repository:
```bash
# Clone the Repository
git clone https://github.com/Ashwin-DevAsh/rMart-Backend.git
cd rMart-Backend

# Install Dependencies
cd rMart-Backend
npm install

# Run the Application
docker-compose up -d
```

## Services

- **Mart Service**: http://localhost:8000 (or the port specified in docker-compose.yml)
- **Profile Service**: http://localhost:8080
- **Email Service**: http://localhost:8888
- **Job Service**: http://localhost:9000
- **Database**: http://localhost:5432