import * as dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { connectToDatabase } from './database';
import employeeRouter from './employee.route'; // Adjusted import statement

dotenv.config();

const { ATLAS_URI, PORT } = process.env;

if (!ATLAS_URI) {
  console.error("No ATLAS_URI environment variable has been declared on config.env");
  process.exit(1);
}

if (!PORT) {
  console.error("No PORT environment variable has been declared on config.env");
  process.exit(1);
}

connectToDatabase(ATLAS_URI)
  .then(() => {
    const app = express();
    app.use(cors());
    app.use(express.json()); // Middleware to parse JSON request bodies
    app.use("/employees", employeeRouter); // Mounting employeeRouter at /employees endpoint

    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}...`);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('Shutting down server...');
      server.close(() => {
        console.log('Server shutdown complete.');
        process.exit(0);
      });
    });

    process.on('SIGTERM', () => {
      console.log('Shutting down server...');
      server.close(() => {
        console.log('Server shutdown complete.');
        process.exit(0);
      });
    });
  })
  .catch(error => {
    console.error("An error occurred during server startup:");
    console.error(error);
    process.exit(1);
  });
