# 🚀 StaffSync Backend - Secure Setup with Docker Secrets

This guide explains how to set up the **StaffSync Backend** using **Docker secrets** for secure credential management.

---

## 📌 Overview

Uses **Docker Secrets** for sensitive credentials (**MongoDB URI, JWT Secret, API Key**).  
This ensures **secure storage** and prevents credentials from being exposed in environment variables.  
Seamlessly integrates with a **Dockerized backend**.

---

## 🛠 Docker Compose Configuration

Add the following to your `docker-compose.yml` file:

```yaml
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
``` 
---
## Create Secret Files

```
mkdir -p secrets
echo "mongodb://database:27017/employees" > secrets/mongo_uri
echo "my-super-secret-jwt-key" > secrets/jwt_secret
echo "12345-abcdef-67890" > secrets/api_key

```
---
##  Modify server.js to Read Secrets

```
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

```
---

## Run the Application
```
docker-compose up -d

```
