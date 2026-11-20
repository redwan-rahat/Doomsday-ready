import { MongoClient } from "mongodb";


const MONGODB_URI = process.env.MONGODB_URI;


if (!MONGODB_URI) {
  throw new Error("MongoDB URI not found");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(MONGODB_URI);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

async function connectDB() {
  const client = await clientPromise;
  return client.db("doomsday-ready");
}

export default connectDB;
