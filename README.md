# 🚀 Node.js Zero-to-Hero Mastery

A production-grade, modular Node.js learning repository demonstrating deep fundamentals, asynchronous architecture, binary streams, native HTTP, Express REST APIs, and cryptographic authentication with persistent SQLite databases.

---

## 🏗️ Repository Architecture

```text
node-mastery/
├── .gitignore                    # Ignores node_modules, .env, and *.db files
├── package.json                  # ES Module configuration and stage runner scripts
├── README.md                     # Portfolio documentation & instructions
├── ROADMAP.md                    # Complete 6-Stage Curriculum Syllabus
│
├── 01-runtime-and-cli/           # Stage 1: The Engine & CLI Core
│   └── src/
│       ├── app.js                # CLI argument parsing with process.argv & validation
│       └── calculator.js         # Pure exported business logic module
│
├── 02-event-loop-and-async/      # Stage 2: Asynchronous Architecture & File System
│   └── src/
│       └── file-manager.js       # Non-blocking file operations with node:fs/promises & try/catch
│
├── 03-buffers-and-streams/       # Stage 3: High-Performance Data Streaming
│   └── src/
│       ├── events-and-buffers.js # Raw binary memory (Buffer) & EventEmitter pattern
│       └── stream-pipeline.js    # Memory-safe chunk streaming with stream.pipeline
│
├── 04-native-http-server/        # Stage 4: Zero-Dependency Web Server
│   └── src/
│       ├── server.js             # Native HTTP server, manual routing, and body streaming
│       └── test-client.js        # Automated test suite using Node built-in fetch
│
├── 05-express-rest-api/          # Stage 5: Production Express REST API
│   └── src/
│       ├── app.js                # Middleware conveyor belt, route params, and CRUD operations
│       └── test-client.js        # Automated test suite verifying GET, POST, DELETE
│
└── 06-auth-and-database/         # Stage 6: The Hero Tier (Security, Auth & SQL Database)
    └── src/
        ├── db.js                 # Native node:sqlite database engine & table schemas
        ├── server.js             # Salt + Scrypt password hashing & Bearer Token auth
        └── test-client.js        # End-to-end authentication & vault protection tests
```

---

## ⚡ Quick Start & Running Each Stage

Clone the repository and install dependencies:
```bash
npm install
```

### Run Any Stage:
```bash
# Stage 1: CLI Arguments & Module Systems
npm run start:1

# Stage 2: Event Loop & Non-blocking File System
npm run start:2

# Stage 3: Buffers, Events & High-Performance Streams
npm run start:3

# Stage 4: Zero-Dependency Native HTTP Server
npm run start:4

# Stage 5: Express Production REST API
npm run start:5

# Stage 6: The Hero Tier (Security & SQLite Database API)
npm run start:6
```

---

## 🧪 Automated Test Verification Suites

Run the end-to-end integration test suites for the web and database stages:

```bash
# Verify Native HTTP Server
npm run test:4

# Verify Express REST API
npm run test:5

# Verify Auth & SQLite Database Vault
npm run test:6
```

---

## 🧠 Key Principles Mastered

- **Single-Threaded Non-blocking I/O:** How the V8 Call Stack delegates slow tasks to the `libuv` background thread pool without blocking the main event loop.
- **Top-Level Await & Modern ESM:** Using standard ECMAScript Modules (`"type": "module"`) with explicit `.js` import extensions.
- **Memory-Safe Streaming:** Avoiding RAM spikes when processing large files by using `Buffer` chunks and `stream.pipeline`.
- **The Middleware Pattern:** Building composable request pipelines in Express using `(req, res, next)`.
- **Cryptographic Security:** Hashing passwords with unique cryptographic salts using `node:crypto.scryptSync` and guarding routes with Bearer Token middleware.
- **Native Embedded Database:** Using Node.js's built-in `node:sqlite` for persistent SQL storage without external binary dependencies.
