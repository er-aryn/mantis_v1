# Mantis - Hackathon MVP

A working implementation of the hackathon problem statement:

- Product marketplace
- Knowledge repository per product
- Intelligent diagnostic assistant with follow-up questioning
- `js-moss` integration path for playbook parsing

## Stack

- Node.js + Express
- Vanilla HTML/CSS/JS frontend
- JSON file persistence (for quick hackathon setup)
- Multer for resource uploads
- `js-moss` + YAML fallback for diagnostic playbook loading

## Features Implemented

### 1) Product Marketplace

- Company creation
- Product creation by company
- Browse/search products
- Product detail page

### 2) Knowledge Repository

- Add resources to each product
- Supports uploaded files and external links
- Resource types: PDF, document, image, video, link

### 3) Intelligent Diagnostic Assistant

- Start issue investigation on a product
- Assistant asks follow-up questions
- Scores probable causes based on answers
- Produces likely root causes and corrective actions
- Includes source references from playbook/manual sections

## Project Structure

- `server.js`: API + static hosting
- `api/lib/store.js`: persistence layer
- `api/lib/playbook.js`: `js-moss` parser + YAML fallback
- `api/lib/assistant.js`: diagnostic workflow engine
- `data/playbooks/default.moss`: troubleshooting knowledge rules
- `public/`: frontend app
- `seed.js`: sample demo data

## Run Locally

```bash
npm install
npm run seed
npm start
```

Open: `http://localhost:3000`

## API Summary

- `GET /api/products?q=`
- `POST /api/companies`
- `POST /api/products`
- `GET /api/products/:id`
- `POST /api/products/:id/resources`
- `POST /api/products/:id/issues`
- `POST /api/assistant/:sessionId/message`

## Notes on Moss Integration

Diagnostic playbooks are stored as `.moss` files under `data/playbooks/`.

The loader tries `js-moss` first. If parsing fails because of environment/package mismatch, it falls back to YAML parsing so the app keeps running during hackathon demos.
