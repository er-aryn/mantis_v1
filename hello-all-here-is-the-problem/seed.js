const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { writeState } = require('./api/lib/store');

// Ensure data directory exists before seeding
const dataDir = path.join(process.cwd(), 'data', 'db');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data/db directory');
}

const companyId = uuidv4();
const product1 = uuidv4();
const product2 = uuidv4();

const now = new Date().toISOString();

writeState({
  companies: [
    {
      id: companyId,
      name: 'VoltRide Mobility',
      description: 'Electric two-wheeler manufacturer',
      createdAt: now
    }
  ],
  products: [
    {
      id: product1,
      companyId,
      name: 'VoltRide S1 Scooter',
      category: 'scooter',
      description: 'Urban electric scooter with regenerative braking.',
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=900',
      createdAt: now
    },
    {
      id: product2,
      companyId,
      name: 'VoltRide Smart Charger',
      category: 'electronics',
      description: 'Adaptive fast charger with thermal protection.',
      imageUrl: 'https://images.unsplash.com/photo-1609592806596-4d8267f03d4f?w=900',
      createdAt: now
    }
  ],
  resources: [
    {
      id: uuidv4(),
      productId: product1,
      title: 'Service Manual v2',
      type: 'pdf',
      filePath: '',
      externalUrl: 'https://example.com/scooter-manual.pdf',
      createdAt: now
    },
    {
      id: uuidv4(),
      productId: product1,
      title: 'Horn Circuit Diagram',
      type: 'image',
      filePath: '',
      externalUrl: 'https://example.com/horn-circuit',
      createdAt: now
    }
  ],
  issues: [],
  sessions: []
});

console.log('Seed complete.');
