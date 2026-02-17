# Cars And Owners App

Application with the ability to register a user to view and manage their data and vehicles

## 🚀 Features

- **Data Management** - Create, update, delete, and manage your users and vehicles
- **Guard** - Manage access levels for service users
- **Safety** - Be confident in the security of your users accounts and their vehicles
- **Cookie Support** - User authentication is done using cookies

## 🛠 Technologies

- Nest.js (Backend)
- Docker & Docker Compose
- PostgreSQL (Database)

## 📋 Prerequisites

- Docker
- Docker Compose

## ⚡ Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
POSTGRES_USER=your_database_user
POSTGRES_PASSWORD=your_database_password
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

JWT_SECRET=your_jwt_secret

SESSION_SECRET=your_session_secret
```

Create a site networks:

```

docker network create <name network>

```

### 2. Launch application and database

```
docker compose up --build --force-recreate
```

This command will start:

- Nest.js application
- PostgreSQL - Primary Database

## 📝 User Managment

### Available Actions

- Create - Create new user
- Get - Read data of user
- Update - Modify existing user
- Delete - Remove user

## 📝 Car Managment

### Available Actions

- Create - Create new car
- Get - Read data of car
- Update - Modify existing car
- Delete - Remove car

## 🚨 Error Handling

If the application encounters any issues during work:

- Error notifications will be sent to console
- Tasks will stop running unless restart

## 🔄 Maintenance

- Application connections use PostgreSQL
- Session data is placed in PostgreSQL
- All services run in Docker containers
- Use docker compose down to stop services

### Launch e2e tests

Exec docker container with following command:

```
docker exec -it cars-owners-app sh
```

Run test with command:

```
npm run test:e2e
```
