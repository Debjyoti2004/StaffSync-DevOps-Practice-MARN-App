# 🛡️ Secure Setup with Docker Secrets (Environment Variables)

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
version: "3.8"

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
    file: ./secrets/mongo_uri  
  jwt_secret:
    file: ./secrets/jwt_secret  
  api_key:
    file: ./secrets/api_key 
``` 
---
## Create Secret Files

```sh
mkdir -p secrets
echo "mongodb://database:27017/employees" > secrets/mongo_uri
echo "my-super-secret-jwt-key" > secrets/jwt_secret
echo "12345-abcdef-67890" > secrets/api_key

```
---
##  Modify server.js to Read Secrets

```js
import fs from "fs";
import { MongoClient, ServerApiVersion } from "mongodb";


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

console.log("MongoDB URI:", MONGODB_URI);  
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

export { db, JWT_SECRET, API_KEY };

```
---

## Run the Application
```sh
docker-compose up -d

```
