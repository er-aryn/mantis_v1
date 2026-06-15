const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'data', 'db', 'state.json');

const INITIAL_STATE = {
  companies: [],
  products: [],
  resources: [],
  issues: [],
  sessions: []
};

function ensureDbFile() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_STATE, null, 2));
  }
}

function readState() {
  ensureDbFile();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeState(state) {
  ensureDbFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2));
}

function updateState(mutator) {
  const state = readState();
  const next = mutator(state) || state;
  writeState(next);
  return next;
}

module.exports = {
  readState,
  writeState,
  updateState,
  DB_PATH
};
