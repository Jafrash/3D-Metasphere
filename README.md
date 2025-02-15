# 3D-Metasphere

Running the Project
This project consists of a backend (using PostgreSQL, Prisma, and Node.js) and a frontend (React). Follow the steps below to set up and run the backend, frontend, and tests.

Backend Setup
1. Database Setup
Navigate to the db directory and run the following command to start a PostgreSQL container:

bash
Copy
Edit
docker run -p 5432:5432 -e POSTGRES_PASSWORD=<your_password> -d postgres
Explanation:
-p 5432:5432: Maps port 5432 of the container to your local machine.
-e POSTGRES_PASSWORD=<your_password>: Sets the PostgreSQL password. Replace <your_password> with your desired password.
-d postgres: Runs the PostgreSQL container in detached mode using the postgres image.
2. Migrate the Database
Run the following command to apply any pending database migrations:

bash
Copy
Edit
npx prisma migrate dev
Explanation:
This applies all migrations to the PostgreSQL database, ensuring the schema is up to date.
3. Generate Prisma Client
Run the following command to generate Prisma client files:

bash
Copy
Edit
npx prisma generate
Explanation:
This generates the necessary Prisma client code to interact with the database.
4. Build and Start the Backend
Navigate to the http directory and run the following commands:

bash
Copy
Edit
npm run build
npm run start
npm run build: Builds the backend code.
npm run start: Starts the backend server.
Running Tests
5. Run Tests
Navigate to the tests directory and run:

bash
Copy
Edit
npm run test
Explanation:
Executes all unit and integration tests to ensure the backend is working correctly.
Frontend Setup
6. Run the Frontend
Navigate to the frontend directory and start the frontend with:

bash
Copy
Edit
npm start
Explanation:
This starts the frontend development server on the default port (usually http://localhost:3000).
Following these steps will set up and run both the backend and frontend of the project.
