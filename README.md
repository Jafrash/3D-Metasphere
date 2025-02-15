# 3D Metasphere  

## Introduction  
This project consists of a backend (using PostgreSQL, Prisma, and Node.js) and a frontend (React). The backend handles the database operations and API endpoints, while the frontend provides an interface for users to interact with the application.  

---

## Backend Setup  

### 1. Database Setup  
Run the following command to start a PostgreSQL container:  
```bash  
docker run -p 5432:5432 -e POSTGRES_PASSWORD=<your_password> -d postgres 
