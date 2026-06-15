# Mantis - Product Support Marketplace

**Live Demo:** https://mantis-app-xx2b.onrender.com/

A full-stack web application for product marketplace management with an intelligent diagnostic assistant. Built for hackathons and rapid prototyping.

## Features

### Product Marketplace
- Company creation and management
- Product catalog with search functionality
- Product detail pages with resources
- Browse and filter products by category

### Knowledge Repository
- Upload resources (PDFs, documents, images, videos)
- Add external links and documentation
- Resources organized by product
- File management with Multer

### Intelligent Diagnostic Assistant
- AI-powered troubleshooting sessions
- Interactive questioning to identify issues
- Root cause analysis with scoring
- Suggested corrective actions with source references
- Playbook-based diagnostic rules

## Tech Stack

- **Backend:** Node.js + Express.js
- **Frontend:** Vanilla HTML5, CSS3, JavaScript
- **Storage:** JSON file persistence
- **File Uploads:** Multer
- **Playbook Parsing:** js-moss + YAML
- **Deployment:** Render (with auto-deploy via GitHub Actions)

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/er-aryn/mantis_v1.git
cd mantis_v1/hello-all-here-is-the-problem

# Install dependencies
npm install

# Create required directories
mkdir -p data/db

# Seed the database
npm run seed

# Start the server
npm start
```

Open http://localhost:3000 in your browser.

## Project Structure

```
mantis/
├── hello-all-here-is-the-problem/
│   ├── server.js              # Express server
│   ├── seed.js                # Demo data
│   ├── public/                # Frontend files
│   ├── api/                   # API logic
│   ├── data/                  # JSON database
│   └── uploads/               # File uploads
├── render.yaml                # Render deployment config
└── README.md                  # This file
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List/search products |
| POST | /api/companies | Create company |
| POST | /api/products | Create product |
| GET | /api/products/:id | Get product details |
| POST | /api/products/:id/resources | Add resource |
| POST | /api/products/:id/issues | Start diagnostic session |
| POST | /api/assistant/:sessionId/message | Chat with assistant |

## Deployment

The app is configured for automatic deployment to Render.

**Using Render Blueprint:**
1. Go to https://dashboard.render.com/blueprints
2. Click "New Blueprint Instance"
3. Connect your GitHub repo
4. Deploy automatically

**Manual deployment:**
1. Go to https://render.com
2. Create a new Web Service
3. Connect your GitHub repo
4. Set build command: `npm install && npm run seed`
5. Set start command: `npm start`

## Environment Variables

```
NODE_ENV=production
PORT=10000
```

## Scripts

- `npm start` - Start the server
- `npm run seed` - Seed the database with demo data
- `npm run dev` - Start in development mode

## Troubleshooting

**Build fails with "ENOENT: no such file or directory"**
- The app automatically creates required directories on startup
- Ensure the build command includes `mkdir -p data/db`

**Port already in use**
- The app uses `process.env.PORT` with fallback to 3000
- Render automatically sets the PORT environment variable

## License

MIT License - Hackathon Project

## Contributing

This is a hackathon MVP. Feel free to fork and extend.

---

Built with Node.js and Express
