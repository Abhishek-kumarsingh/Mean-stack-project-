import * as mongodb from "mongodb";
import { Employee } from "./employee";

export const collections: {
    employees?: mongodb.Collection<Employee>;
} = {}

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("meanStackProject");
    await applySchemaValidation(db);

    const employeesConnection = db.collection<Employee>('employees');
    collections.employees = employeesConnection;
}

async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "position", "level"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required."
                },
                position: {
                    bsonType: "string",
                    description: "'position' is required.",
                    minLength: 5
                },
                level: {
                    bsonType: "string",
                    description: "'level' is required.",
                    enum: ["junior", "mid", "senior"]
                }
            }
        }
    };

    try {
        await db.command({
            collMod: 'employees', // Corrected collection name
            validator: jsonSchema
        });
    } catch (error) {
        console.error("Error applying schema validation:", error);
        if (error.codeName === 'NamespaceNotFound') {
            try {
                await db.createCollection('employees', { validator: jsonSchema });
            } catch (createError) {
                console.error("Error creating collection:", createError);
            }
        }
    }
}
