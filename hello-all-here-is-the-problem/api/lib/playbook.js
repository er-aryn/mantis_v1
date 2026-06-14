const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

let mossModule = null;
try {
  mossModule = require('js-moss');
} catch (error) {
  mossModule = null;
}

function parseWithMoss(raw) {
  if (!mossModule) {
    return null;
  }

  const candidates = [
    mossModule.parse,
    mossModule.hydrate,
    mossModule.load,
    mossModule.default && mossModule.default.parse,
    mossModule.default && mossModule.default.hydrate,
    mossModule.default && mossModule.default.load
  ].filter(Boolean);

  for (const fn of candidates) {
    try {
      const parsed = fn(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch (error) {
      continue;
    }
  }

  return null;
}

function loadPlaybook(productCategory) {
  const safeCategory = (productCategory || 'default').toLowerCase().trim();
  const byCategory = path.join(process.cwd(), 'data', 'playbooks', `${safeCategory}.moss`);
  const fallback = path.join(process.cwd(), 'data', 'playbooks', 'default.moss');
  const filePath = fs.existsSync(byCategory) ? byCategory : fallback;

  const raw = fs.readFileSync(filePath, 'utf8');
  const mossParsed = parseWithMoss(raw);

  if (mossParsed) {
    return mossParsed;
  }

  return yaml.load(raw);
}

module.exports = {
  loadPlaybook
};
