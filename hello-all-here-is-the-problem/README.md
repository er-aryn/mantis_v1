# Mantis - Product Support Marketplace

A full-stack web application for product marketplace management with an intelligent diagnostic assistant. Built for hackathons and rapid prototyping.

![Mantis App](https://img.shields.io/badge/Node.js-Express-green?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)

## ✨ Features

### 🏪 Product Marketplace
- **Company Management**: Create and manage companies
- **Product Catalog**: Add products with details, images, and descriptions
- **Browse & Search**: Find products quickly with search functionality
- **Product Details**: View comprehensive product information

### 📚 Knowledge Repository
- **Resource Uploads**: Support for PDFs, documents, images, videos
- **External Links**: Add reference URLs and documentation
- **Product-Specific**: Resources organized by product
- **File Management**: Built-in upload handling with Multer

### 🤖 Intelligent Diagnostic Assistant
- **Issue Investigation**: Start troubleshooting sessions
- **Smart Questioning**: AI asks follow-up questions to narrow down issues
- **Root Cause Analysis**: Scores and ranks probable causes
- **Corrective Actions**: Suggests solutions with source references
- **MOSS Integration**: Uses `js-moss` for playbook parsing with YAML fallback

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: Vanilla HTML5, CSS3, JavaScript
- **Storage**: JSON file persistence (lightweight, no database needed)
- **File Uploads**: Multer
- **Playbook Parsing**: `js-moss` + YAML fallback
- **Utilities**: UUID generation, js-yaml

## 📁 Project Structure

```
mantis/
├── server.js                 # Main Express server + static hosting
├── seed.js                   # Demo data generator
├── package.json              # Dependencies and scripts
│
├── api/
│   ├── lib/
│   │   ├── store.js         # JSON persistence layer
│   │   ├── playbook.js      # MOSS/YAML playbook parser
│   │   └── assistant.js     # Diagnostic workflow engine
│   └── routes/              # API routes
│
├── data/
│   ├── db/                  # JSON database files
│   └── playbooks/
│       └── default.moss     # Diagnostic rules
│
├── public/                   # Frontend assets
│   ├── index.html
│   ├── css/
│   └── js/
│
├── uploads/                 # Uploaded files storage
└── .vscode/                 # VS Code configuration
    └── launch.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/er-aryn/mantis_v1.git
   cd mantis_v1/hello-all-here-is-the-problem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create required directories**
   ```bash
   mkdir -p data/db
   ```

4. **Seed the database** (first time only)
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the production server |
| `npm run dev` | Start the development server |
| `npm run seed` | Generate sample demo data |

## 🔌 API Endpoints

### Products
```
GET    /api/products?q={search}     # Search products
GET    /api/products/:id            # Get product details
POST   /api/products                # Create new product
```

### Companies
```
POST   /api/companies               # Create new company
```

### Resources
```
POST   /api/products/:id/resources  # Upload resource to product
```

### Diagnostic Assistant
```
POST   /api/products/:id/issues     # Start issue investigation
POST   /api/assistant/:sessionId/message  # Chat with assistant
```

## 💻 Development

### Using VS Code

1. Open the project in VS Code:
   ```bash
   code .
   ```

2. Press `F5` to start debugging, or use the Run menu → Start Debugging

3. The debugger will automatically start the server and attach to it

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `HOST` | `localhost` | Server host binding |

## 🔧 Troubleshooting

### Common Issues

**Error: Cannot find module 'xxx'**
```bash
npm install
```

**Error: ENOENT: no such file or directory, open 'data/db/state.json'**
```bash
mkdir -p data/db
npm run seed
```

**Port already in use**
```bash
# Kill existing process
npx kill-port 3000
# Or change port
PORT=3001 npm start
```

### Windows-Specific

If using Windows PowerShell:
```powershell
# Create directory
mkdir data\db

# Set environment variable
$env:PORT=3000
npm start
```

## 🧪 Testing

The app includes demo data via `seed.js` which creates:
- Sample companies
- Sample products with resources
- Sample diagnostic playbooks

Run `npm run seed` anytime to reset to demo data.

## 📄 License

MIT License - Hackathon Project

## 👥 Contributing

This is a hackathon MVP. Feel free to fork and extend!

---

Built with ❤️ for hackathons
