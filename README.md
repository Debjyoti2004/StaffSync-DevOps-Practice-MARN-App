services:
  backend:
    build: ./backend
    ports:
      - "5050:5050"
    networks:
      - private-network
    depends_on:
      - database
    environment:
      - MONGODB_URI_FILE=/run/secrets/mongo_uri
      - JWT_SECRET_FILE=/run/secrets/jwt_secret
      - API_KEY_FILE=/run/secrets/api_key
    secrets:
      - mongo_uri
      - jwt_secret
      - api_key

secrets:
  mongo_uri:
    file: ./secrets/mongo_uri  # Secure MongoDB URI
  jwt_secret:
    file: ./secrets/jwt_secret  # Secure JWT secret
  api_key:
    file: ./secrets/api_key  # Secure API key
✅ Each secret is securely stored in a file and mapped inside the container at /run/secrets/....

📝 Step 2: Create Secret Files
Run the following commands:

mkdir -p secrets
echo "mongodb://database:27017/employees" > secrets/mongo_uri
echo "my-super-secret-jwt-key" > secrets/jwt_secret
echo "12345-abcdef-67890" > secrets/api_key
✅ Now, the secrets are stored in files and ready to be used by Docker.

📝 Step 3: Modify server.js to Read Secrets
Instead of using process.env, read the secret files inside your Node.js application.

import fs from "fs";
import { MongoClient, ServerApiVersion } from "mongodb";

// Read secrets from Docker Secrets
const readSecret = (path) => {
  try {
    return fs.readFileSync(path, "utf8").trim();
  } catch (err) {
    console.error(`Failed to read secret from ${path}:`, err);
    process.exit(1);
  }
};

const MONGODB_URI = readSecret("/run/secrets/mongo_uri");
const JWT_SECRET = readSecret("/run/secrets/jwt_secret");
const API_KEY = readSecret("/run/secrets/api_key");

console.log("MongoDB URI:", MONGODB_URI);  // Just for debugging, remove in production
console.log("JWT Secret:", JWT_SECRET);
console.log("API Key:", API_KEY);

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("Connected to MongoDB securely!");
} catch (err) {
  console.error("MongoDB Connection Error:", err);
}

let db = client.db("employees");

export { db, JWT_SECRET, API_KEY }; // Export secrets for use in other parts of the app


---

### ✅ Secure Storage of Secrets
Each secret is securely stored in a file and mapped inside the container at `/run/secrets/...`.

---

### 📝 Step 2: Create Secret Files

Create a `secrets` directory and add secret values in separate files.

Run the following commands:

```sh
mkdir -p secrets
echo "mongodb://database:27017/employees" > secrets/mongo_uri
echo "my-super-secret-jwt-key" > secrets/jwt_secret
echo "12345-abcdef-67890" > secrets/api_key


✅ Now, the secrets are stored in files and ready to be used by Docker.

📝 Step 3: Modify server.js to Read Secrets
Instead of using process.env, read the secret files inside your Node.js application.

server.js

import fs from "fs";
import { MongoClient, ServerApiVersion } from "mongodb";

// Function to read secrets from Docker Secrets
const readSecret = (path) => {
  try {
    return fs.readFileSync(path, "utf8").trim();
  } catch (err) {
    console.error(`Failed to read secret from ${path}:`, err);
    process.exit(1);
  }
};

// Load secrets
const MONGODB_URI = readSecret("/run/secrets/mongo_uri");
const JWT_SECRET = readSecret("/run/secrets/jwt_secret");
const API_KEY = readSecret("/run/secrets/api_key");

console.log("MongoDB URI:", MONGODB_URI);  // Debugging only, remove in production
console.log("JWT Secret:", JWT_SECRET);
console.log("API Key:", API_KEY);

// Connect to MongoDB
const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("Connected to MongoDB securely!");
} catch (err) {
  console.error("MongoDB Connection Error:", err);
}

// Export database and secrets
let db = client.db("employees");

export { db, JWT_SECRET, API_KEY };
✅ This ensures secrets are read securely from Docker Secrets and not exposed in environment variables.

🚀 Step 4: Run the Application
Once everything is set up, start the application using:

docker-compose up -d
Check running containers:

docker ps
To verify the backend logs:

docker logs -f staffsync-backend-1
