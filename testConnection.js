// Import the MongoClient from the MongoDB package
import { MongoClient } from 'mongodb';

// Define your MongoDB URI (connection string)
const DB_URI = 'mongodb://localhost:27017/subscription-tracker'; // Replace with your connection string if needed

async function testConnection() {
    console.log('Connecting to MongoDB...');
  try {
    // Create a MongoClient instance and pass the URI
    const client = new MongoClient(DB_URI);

    // Connect to the database server
    await client.connect();
    console.log('Successfully connected to MongoDB!');

    // Access the "subscription-tracker" database (it may not exist yet; MongoDB will create it when needed)
    const db = client.db();
    
    // Access the "test" collection (use any existing collection or just test connectivity)
    const collection = db.collection('test');

    // Run a simple query to check the connection
    const result = await collection.findOne({});
    console.log('Test query result:', result);

    // Close the connection after the test
    await client.close();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Run the test function
testConnection();
