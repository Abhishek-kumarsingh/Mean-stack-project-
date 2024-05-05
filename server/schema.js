const jsonSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["name", "position", "level"],
        additionalProperties: false,
        properties: {
            name: {
                bsonType: "string",
                description: "The employee's name is required."
            },
            position: {
                bsonType: "string",
                description: "The employee's position is required and must have a minimum length of 5 characters.",
                minLength: 5
            },
            level: {
                bsonType: "string",
                description: "The employee's level is required and must be one of 'junior', 'mid', or 'senior'.",
                enum: ["junior", "mid", "senior"]
            }
        }
    }
};

module.exports = jsonSchema;
