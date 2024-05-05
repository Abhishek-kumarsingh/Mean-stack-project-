import express from "express";
import { ObjectId } from 'mongodb';
import { collections } from './database';
import * as mongodb from 'mongodb';

const employeeRouter = express.Router();
employeeRouter.use(express.json());

// POST endpoint to create a new employee
employeeRouter.post('/', async (req, res) => {
    try {
        const employee = req.body;

        // Input validation
        if (!employee || !employee.name || !employee.position || !employee.level) {
            return res.status(400).send("Missing required fields");
        }

        const result = await collections.employees.insertOne(employee);

        if (result.acknowledged) {
            res.status(201).send(`Created a new employee with ID: ${result.insertedId}`);
        } else {
            res.status(500).send("Failed to create new employee");
        }
    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).send("Internal server error");
    }
});

// GET endpoint to retrieve all employees
employeeRouter.get('/', async (_req, res) => {
    try {
        const employees = await collections.employees.find({}).toArray();
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error retrieving employees:", error);
        res.status(500).send("Internal server error");
    }
});

// GET endpoint to retrieve a specific employee by ID
employeeRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = {_id: new mongodb.ObjectId(id)};
        const employee = await collections.employees.findOne(query);

        if (employee) {
            res.json(employee);
        } else {
            res.status(404).send("Employee not found");
        }
    } catch (error) {
        console.error(`Error finding employee with ID ${req.params.id}:`, error);
        res.status(500).send("Internal server error");
    }
});

// PUT endpoint to update an existing employee by ID
employeeRouter.put('/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        const updatedEmployee = req.body;

        // Input validation
        if (!updatedEmployee || !updatedEmployee.name || !updatedEmployee.position || !updatedEmployee.level) {
            return res.status(400).send("Missing required fields");
        }

        const result = await collections.employees.updateOne(
            { _id: new ObjectId(employeeId) },
            { $set: updatedEmployee }
        );

        if (result.modifiedCount > 0) {
            res.status(200).send("Employee updated successfully");
        } else {
            res.status(404).send("Employee not found");
        }
    } catch (error) {
        console.error(`Error updating employee with ID ${req.params.id}:`, error);
        res.status(500).send("Internal server error");
    }
});

// DELETE endpoint to remove an employee by ID
employeeRouter.delete('/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        const result = await collections.employees.deleteOne({ _id: new ObjectId(employeeId) });

        if (result.deletedCount > 0) {
            res.status(200).send("Employee deleted successfully");
        } else {
            res.status(404).send("Employee not found");
        }
    } catch (error) {
        console.error(`Error deleting employee with ID ${req.params.id}:`, error);
        res.status(500).send("Internal server error");
    }
});

export default employeeRouter;
